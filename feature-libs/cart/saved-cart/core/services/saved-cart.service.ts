import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  Cart,
  getWishlistName,
  MultiCartService,
  ProcessSelectors,
  StateUtils,
  StateWithMultiCart,
  StateWithProcess,
  UserIdService,
  UserService,
} from '@spartacus/core';
import { combineLatest, Observable, queueScheduler } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  observeOn,
  pluck,
  shareReplay,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { SAVED_CART_LIST_PROCESS_ID } from '../store';
import { SavedCartActions } from '../store/actions/index';

@Injectable({
  providedIn: 'root',
})
export class SavedCartService {
  constructor(
    protected store: Store<StateWithMultiCart | StateWithProcess<void>>,
    protected userIdService: UserIdService,
    protected userService: UserService,
    protected multiCartService: MultiCartService
  ) {}

  loadSavedCart(cartId: string): void {
    this.userIdService.takeUserId(true).subscribe(
      (userId) => {
        return this.store.dispatch(
          new SavedCartActions.LoadSavedCart({ userId, cartId })
        );
      },
      () => {}
    );
  }

  get(cartId: string): Observable<Cart> {
    return this.getSavedCart(cartId).pipe(
      observeOn(queueScheduler),
      tap((state) => {
        if (!(state.loading || state.success || state.error)) {
          this.loadSavedCart(cartId);
        }
      }),
      filter((state) => state.success || state.error),
      map((state) => state.value)
    );
  }

  getSavedCart(
    cartId: string
  ): Observable<StateUtils.ProcessesLoaderState<Cart>> {
    return this.multiCartService.getCartEntity(cartId);
  }

  loadSavedCarts(): void {
    this.userIdService.takeUserId(true).subscribe(
      (userId) => {
        return this.store.dispatch(
          new SavedCartActions.LoadSavedCarts({ userId })
        );
      },
      () => {}
    );
  }

  getList(): Observable<Cart[]> {
    return this.getSavedCartList().pipe(
      withLatestFrom(this.getSavedCartListProcess()),
      tap(([_, state]) => {
        if (!(state.loading || state.success || state.error)) {
          this.loadSavedCarts();
        }
      }),
      pluck(0),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  getSavedCartList(): Observable<Cart[]> {
    return combineLatest([
      this.multiCartService.getCarts(),
      this.userService.get(),
    ]).pipe(
      distinctUntilChanged(),
      map(([carts, user]) =>
        carts.filter(
          (cart) =>
            cart?.name !== getWishlistName(user?.customerId) && cart?.saveTime
        )
      )
    );
  }

  getSavedCartListProcess(): Observable<StateUtils.LoaderState<any>> {
    return this.store.pipe(
      select(
        ProcessSelectors.getProcessStateFactory(SAVED_CART_LIST_PROCESS_ID)
      )
    );
  }

  clearSavedCarts(): void {
    this.store.dispatch(new SavedCartActions.ClearSavedCarts());
  }

  restoreSavedCart(cartId: string): void {
    this.userIdService.takeUserId(true).subscribe(
      (userId) => {
        return this.store.dispatch(
          new SavedCartActions.RestoreSavedCart({ userId, cartId })
        );
      },
      () => {}
    );
  }

  deleteSavedCart(cartId: string): void {
    this.userIdService.takeUserId(true).subscribe(
      (userId) => {
        this.multiCartService.deleteCart(cartId, userId);
      },
      () => {}
    );
  }
}
