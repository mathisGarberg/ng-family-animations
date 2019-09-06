import { Component, OnInit } from '@angular/core';
import { filter, tap, map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, of, Observable, Subject, merge } from 'rxjs';
import {
  trigger,
  style,
  state,
  animate,
  transition,
  query,
  stagger,
  keyframes
} from '@angular/animations';
import { families, people } from './mock-data';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('pageAnimations', [
      transition('* <=> *',  [
        query(':enter', style({ opacity: 0 }), { optional: true }),
         query(':enter', [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(75, [
              style({ transform: 'translateY(10%)', opacity: 0 }),
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateY(0%)', opacity: 1 })
              )
            ])
          ], { optional: true })
      ])
    ]),
    trigger('shrinkOut', [
      state('open', style({
        opacity: 1,
        backgroundColor: 'red'
      })),
      state('closed', style({
        display: 'none'
      })),
      transition('* => closed', [
        animate('.4s', style({
          opacity: 0,
          transform: 'translateX(80%)'
        }))
      ])
    ])
  ]
})
export class AppComponent {

  deleteItem = of(
    {
      title: 'Simulating HTTP Requests',
      content: 'This is off the hook!!'
    });

  familyHead$ = of(families);

  familiesSource$ = new Subject<{ lastname: string, familyMembers?: { id: number, name: string }[] }[]>();
  families$ = merge(
    this.familyHead$.pipe(map(this.createFamily)),
    this.familiesSource$
  ).pipe(shareReplay(1));

  peopleSource$ = new BehaviorSubject<Observable<{ id: number, name: string }[]>>(of(people));

  people$ = this.peopleSource$.asObservable();

  deleteElement(elementToDelete: { id: number, name: string }): void {
    this.peopleSource$.getValue().toPromise()
      // .then(v => v.filter(p => p.id !== elementToDelete.id))
      .then(res => {
        const personWithDeleteState = res.map(p => (p.id === elementToDelete.id) ? {...p, animationState: 'closed'} : p);

        console.log(personWithDeleteState);

      this.deleteItem.subscribe(() => this.peopleSource$.next(of(personWithDeleteState)));
    })
  }

  chooseFamily(family: { lastname: string, familyMembers?: { id: number, name: string }[] }): void {
    family.familyMembers.map(familyMember => {
      return { ...familyMember, animationState: 'open' };
    })

    console.log(family.familyMembers);

    this.peopleSource$.next(of(family.familyMembers));
  }

  createFamily(families: { lastname: string, familyMembers?: { id: number, name: string }[] }[]) {
    return families.map((family: { lastname: string, familyMembers?: { id: number, name: string }[] }, i) => {
        return family;
    });
  }

  findStringInObjArr(objArr: any): boolean {
    return objArr.filter(obj => obj.animationState === 'closed').length === objArr.length;
  }
}
