import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Job } from '../data/jobs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs : AngularFirestore) { }

  addData(job : Job){
    job.id = this.afs.createId();
    return this.afs.collection('/Jobs').add(job);

  }

  getAllJobs(){
    return this.afs.collection('/Jobs').snapshotChanges();
  }

  deleteJob(job : Job){
    return this.afs.doc('/Jobs/'+job.id).delete();

  }

  updateJob(job :Job){
    this.deleteJob(job);
    this.addData(job);
  }
}
