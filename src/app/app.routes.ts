import { Routes } from '@angular/router';
import { App } from './app';
import { Search } from './search/search';

export const routes: Routes = [{
    path: '', component: App
},
{
    path: 'search', component: Search
}];
