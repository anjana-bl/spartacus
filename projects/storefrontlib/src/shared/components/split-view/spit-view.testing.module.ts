import { Component, Input, NgModule, Output } from '@angular/core';

@Component({
  template: '',
  selector: 'cx-split-view',
})
class MockSplitViewComponent {}

@Component({
  template: '',
  selector: 'cx-view',
})
class MockViewComponent {
  @Input() position: number;
  @Input() hidden;
  @Output() hiddenChange;
}

const mockComponents = [MockSplitViewComponent, MockViewComponent];

@NgModule({
  declarations: mockComponents,
  exports: mockComponents,
})
export class SplitViewTestingModule {}
