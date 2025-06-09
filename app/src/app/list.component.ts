import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface BadItem {
  badid_text: string;
  bad: string;
  becken: string;
  plz: string;
  ort: string;
  date: string;
  date_pretty: string;
  beckenid: number;
  temp: number;
  ortlat: number;
  ortlong: number;
  dist?: number;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  items: BadItem[] = [];
  filtered: BadItem[] = [];
  searchInput = '';
  sortBy: 'dist' | 'date' = 'dist';
  userLat?: number;
  userLon?: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.http
      .get<BadItem[]>(
        'https://beta.wiewarm.ch:443/api/v1/temperature/all_current.json/0'
      )
      .subscribe({
        next: (data) => {
          this.items = data.filter((d) => d.ortlat && d.ortlong);
          this.applyFilter();
        },
        error: (err) => {
          console.error('load failed', err);
        },
      });
  }

  requestPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.userLat = pos.coords.latitude;
        this.userLon = pos.coords.longitude;
        this.computeDistances();
        this.applyFilter();
      });
    }
  }

  computeDistances() {
    if (this.userLat == null || this.userLon == null) {
      return;
    }
    for (const item of this.items) {
      item.dist = this.distance(
        this.userLat,
        this.userLon,
        item.ortlat,
        item.ortlong
      );
    }
  }

  distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000; // m
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    const res = this.items.filter((item) => {
      const str = `${item.bad} ${item.becken} ${item.ort} ${item.plz}`.toLowerCase();
      return !term || str.includes(term);
    });
    res.sort((a, b) => {
      if (this.sortBy === 'date') {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      }
      const da = a.dist ?? Infinity;
      const db = b.dist ?? Infinity;
      if (da === db) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      }
      return da - db;
    });
    this.filtered = res;
  }
}
