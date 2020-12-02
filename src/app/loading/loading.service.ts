import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {

  constructor() {
    console.log('Loading service is created...');
  }

  // <boolean> mean type, (false) mean the default value
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    // First, we are creating a default(null) observable just to create an observable chain
    // tap operator is for making a side effect function, to turn on loading
    // then we switch to outputing the observable value that we passed in as the parameter using concatMap
    // and finally, turn off the spinner
    return of(null)
      .pipe(
        tap(() => this.loadingOn()),
        concatMap(() => obs$),
        finalize(() => this.loadingOff())
      );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
