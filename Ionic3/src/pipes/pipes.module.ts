import { NgModule } from '@angular/core';
import { OrderByPipe } from './order-by/order-by';
import { FormatCoordinatesPipe } from './format-coordinates/format-coordinates';
@NgModule({
	declarations: [OrderByPipe,
    FormatCoordinatesPipe],
	imports: [],
	exports: [OrderByPipe,
    FormatCoordinatesPipe]
})
export class PipesModule {}
