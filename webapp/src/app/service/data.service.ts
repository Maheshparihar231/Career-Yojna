import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Job } from '../data/jobs';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs : AngularFirestore) { }

  isInitialized(): boolean {
    return !!this.afs;
  }

  addData(job : Job){
    job.id = this.afs.createId();
    return this.afs.collection('/Jobs').add(job);

  }

  getAllJobs(): Observable<Job[]> {
    console.log('DataService: Starting jobs fetch...');
    return this.afs.collection('/Jobs').snapshotChanges().pipe(
      map(snapshots => {
        console.log('DataService: Raw data count:', snapshots?.length || 0);
        
        const jobs = snapshots.map(doc => {
          const data = doc.payload.doc.data() as Record<string, any>;
          const id = doc.payload.doc.id;
          
          return {
            id,
            title: data['title'] || 'Untitled Position',
            company_name: data['company_name'] || 'Company Name Not Available',
            mini_description: data['mini_description'] || 'No description available',
            post_date: data['post_date'] ? new Date(data['post_date']) : new Date(),
            img_url: data['img_url'] || 'assets/images/default-company.png',
            description: data['description'] || '',
            apply_link: data['apply_link'] || '',
            role: data['role'] || '',
            department: data['department'] || '',
            remote: data['remote'] || '',
            location: data['location'] || '',
            job_type: data['job_type'] || '',
            salary: data['salary'] || 0,
            experience: data['experience'] || '',
            qualification: data['qualification'] || '',
            skills_required: Array.isArray(data['skills_required']) ? data['skills_required'] : [],
            benefits: Array.isArray(data['benefits']) ? data['benefits'] : [],
            responsibilities: Array.isArray(data['responsibilities']) ? data['responsibilities'] : [],
            requirements: Array.isArray(data['requirements']) ? data['requirements'] : [],
            deadline: data['deadline'] ? new Date(data['deadline']) : new Date()
          } as Job;
        });
        
        if (jobs.length === 0) {
          console.log('DataService: No jobs found in snapshot');
        } else {
          console.log('DataService: Processed jobs:', jobs.length, 'First job:', jobs[0]);
        }
        return jobs;
      })
    );
  }

  deleteJob(job : Job){
    return this.afs.doc('/Jobs/'+job.id).delete();

  }

  getJobById(jobId: string) {
    // First increment the view count
    this.incrementJobViews(jobId);
    // Then return the job data
    return this.afs.collection('/Jobs').doc(jobId).valueChanges();
  }

  updateJob(job: Job) {
    this.deleteJob(job);
    this.addData(job);
  }

  /**
   * Increment the view count for a specific job
   * Uses Firebase's atomic increment operation to ensure accuracy
   */
  private incrementJobViews(jobId: string) {
    const jobRef = this.afs.collection('/Jobs').doc(jobId);
    
    jobRef.get().subscribe(doc => {
      if (doc.exists) {
        const data = doc.data() as Record<string, any>;
        jobRef.update({
          views: (data['views'] || 0) + 1,
          last_viewed: new Date()
        }).then(() => {
          console.log('View count updated successfully');
        }).catch(error => {
          console.error('Error updating view count:', error);
        });
      }
    });
  }
}
