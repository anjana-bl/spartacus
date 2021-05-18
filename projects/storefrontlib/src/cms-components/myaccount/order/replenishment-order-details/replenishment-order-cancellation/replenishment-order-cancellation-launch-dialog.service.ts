import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  LaunchDialogService,
  LAUNCH_CALLER,
} from '../../../../../layout/launch-dialog/index';

// TODO(#12167): deprecations cleanup
/**
 * @deprecated since 3.3 - use `LaunchDialogService` instead
 */
@Injectable({ providedIn: 'root' })
export class ReplenishmentOrderCancellationLaunchDialogService {
  constructor(protected launchDialogService: LaunchDialogService) {}

  /**
   * @deprecated since 3.3 - use `LaunchDialogService.openDialog` with LAUNCH_CALLER.REPLENISHMENT_ORDER instead
   */
  openDialog(
    openElement?: ElementRef,
    vcr?: ViewContainerRef,
    data?: any
  ): Observable<any> | undefined {
    const component = this.launchDialogService.launch(
      LAUNCH_CALLER.REPLENISHMENT_ORDER,
      vcr,
      data
    );

    if (component) {
      return combineLatest([
        component,
        this.launchDialogService.dialogClose,
      ]).pipe(
        filter(([, close]) => close && close !== undefined),
        tap(([comp]) => {
          openElement?.nativeElement.focus();
          this.launchDialogService.clear(LAUNCH_CALLER.REPLENISHMENT_ORDER);
          comp.destroy();
        }),
        map(([comp]) => comp)
      );
    }
  }
}
