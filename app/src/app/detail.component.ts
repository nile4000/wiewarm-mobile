import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  bad: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('badidText');
    if (id) {
      this.http
        .get(`https://beta.wiewarm.ch/api/v1/bad/${id}`)
        .subscribe({
          next: (d) => (this.bad = d),
          error: (e) => console.error('detail failed', e),
        });
    }
  }
}
