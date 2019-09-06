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

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('pageAnimations', [
      transition('* <=> *',  [
        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true }),

        query(':leave', stagger('300ms', [
          animate('200ms ease-in', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ]),
    trigger('shrinkOut', [
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.5,
        backgroundColor: 'green'
      })),
      transition('* => void', [
        animate('1s')
      ]),
    ])
  ]
})
export class AppComponent {

  deleteItem = of(
    {
      title: 'Simulating HTTP Requests',
      content: 'This is off the hook!!'
    });

  familyHead$ = of([
    {
      id: 1,
      lastname: 'Garberg',
      familyMembers: [  { id: 1, name: 'Anne Katt' }, { id: 2, name: 'Hitler' }, { id: 3, name: 'Elton John' }, { id: 4, name: 'Michael Jackson' }, { id: 5, name: 'Haien Stog' }]
    },
    {
      id: 2,
      lastname: 'Tveiten',
      familyMembers: [  { id: 1, name: 'Mathis' }, { id: 4, name: 'Brunhild' }, { id: 5, name: 'Haien Stog' }]
    },
    {
      id: 3,
      lastname: 'Jensen',
      familyMembers: [  { id: 1, name: 'Mathis' }, { id: 2, name: 'Plorb' }]
    }
  ]);

  familiesSource$ = new Subject<{ lastname: string, familyMembers?: { id: number, name: string }[] }[]>();
  families$ = merge(
    this.familyHead$.pipe(map(this.createFamily)),
    this.familiesSource$
  ).pipe(shareReplay(1));

  peopleSource$ = new BehaviorSubject<Observable<{ id: number, name: string }[]>>(of([{
    id: 1,
    name: 'Mathis',
    animationState: 'open'
  }, {
    id: 2,
    name: 'Plorb',
    animationState: 'open'
  },
  {
    id: 3,
    name: 'Jonas',
    animationState: 'open'
  },
  {
    id: 4,
    name: 'Brunhild',
    animationState: 'open'
  },
  {
    id: 5,
    name: 'Haien Stog',
    animationState: 'open'
  }]));

  people$ = this.peopleSource$.asObservable();

  deleteElement(elementToDelete: { id: number, name: string }): void {
    this.peopleSource$.getValue().toPromise().then(value =>
      value.filter(person => person.id !== elementToDelete.id)
    ).then(res => {
      this.deleteItem.subscribe(() => this.peopleSource$.next(of(res)));
    })
  }

  chooseFamily(family: { lastname: string, familyMembers?: { id: number, name: string }[] }): void {
    family.familyMembers.map(familyMember => {
      return { ...familyMember, animationState: 'closed' };
    })

    this.peopleSource$.next(of(family.familyMembers));
  }

  createFamily(families: { lastname: string, familyMembers?: { id: number, name: string }[] }[]) {
    return families.map((family: { lastname: string, familyMembers?: { id: number, name: string }[] }, i) => {
        return family;
    });
  }
}
