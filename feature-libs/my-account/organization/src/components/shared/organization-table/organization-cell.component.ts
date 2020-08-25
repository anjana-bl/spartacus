import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import {
  OutletContextData,
  TableDataOutletContext,
} from '@spartacus/storefront';

@Component({
  templateUrl: './organization-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationCellComponent {
  @HostBinding('class') cls = 'content-wrapper';

  constructor(protected outlet: OutletContextData<TableDataOutletContext>) {}

  get model(): any {
    return this.outlet.context;
  }

  get property(): string {
    return this.model[this.outlet?.context?._field];
  }

  get route(): string {
    return this.outlet.context._type + 'Details';
  }

  get routeModel(): any {
    return this.outlet.context;
  }
}
