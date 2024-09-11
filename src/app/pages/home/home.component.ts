import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from "./task.type";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './home.component.html'
})

export class HomeComponent {

  addInput:FormControl= new FormControl('', {nonNullable:true, validators:[Validators.required]})

  footer = signal('©2024 Víctor Hugo Coronado')

  filter = signal<'all' | 'pending' | 'completed'>('all')

  taskBySignals = computed( () => {

    const filter = this.filter()
    const tasks = this.tasks()

    if (filter === 'pending') {

      return tasks.filter(task => !task.state)

    }

    if (filter === 'completed') {
      
      return tasks.filter (task => task.state)

    }

    return tasks

  })

  tasks = signal<Task[]> ([])

  injector = inject(Injector)

  constructor(){

    this.addInput.valueChanges
    .subscribe(response=>{
      //this.footer.set(response)
    })

  }

  ngOnInit(){

    const storage = localStorage.getItem('tasks')
    console.log(storage)
    if (storage) {

      const tasks = JSON.parse(storage)
      this.tasks.set(tasks)

    }

    this.trackTasks()

  }

  trackTasks(){

    effect(()=>{

      const tasks = this.tasks()
      localStorage.setItem('tasks', JSON.stringify(tasks))
      
    }, { injector:this.injector })

  }

  updateFotter(){
    //this.tasks.set.
  }

  addItem(){

    if (this.addInput.valid || this.addInput.value != '') {

      if (this.addInput.value.trim() != '') {

        const newTask:Task ={
          id:Date.now(),  
          title: this.addInput.value.trim(),
          state:true
        }
       
        this.tasks.update((tasks)=>[...tasks, newTask])
        this.addInput.reset()

      }

    }

  }

  removeItem(index:number){

    this.tasks.update( (tasks) => tasks.filter(( task, position) => position!=index ) )

  }

  updateState(event:Event, index:number){

    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    
    this.tasks.update( (tasks) => {

      return tasks.map((task, position) =>{

        if (position == index) {
          return {
            ...task,
            state:isChecked
          }
        }

        return task


      })

    } )

  }

  changeFilter(state:'all' | 'pending' | 'completed'){
    this.filter.set(state)
  }

  

}
