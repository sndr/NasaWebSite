import { Component } from '@angular/core';
import {RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [RouterOutlet],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {
  items = [
    { title: 'Mars Rover', description: 'Explore the latest images and data from the Mars Rover missions.' },
    { title: 'Hubble Telescope', description: 'Discover stunning images captured by the Hubble Space Telescope.' },
    { title: 'Astronomy Picture of the Day', description: 'View a new astronomy picture every day along with a brief explanation.' },
    { title: 'NASA Missions', description: 'Learn about current and past NASA missions exploring our solar system and beyond.' },
    { title: 'Space Weather', description: 'Stay updated on space weather events and their impact on Earth.' }
  ];

  readapi(): Promise<string> {
    return fetch('src/app/search/api.validation.txt')
      .then(response => response.text())
      .then(data => {
        const apiKey = data.split('=')[1].trim().replace(/"/g, '');
        return apiKey;
      })
      .catch(error => {
        console.error('Error reading API key:', error);
        return '';
      });
  }

  searchValidation() { // Validate search input
    const inputElement = document.querySelector('.search_input') as HTMLInputElement;
    const query = inputElement.value.trim();
    return query;
  }

  searchingApi() { // Perform search using NASA API
    const query = this.searchValidation();
    if (!query) {
      console.error('Search query is empty.');
      return;
    }

    interface ApiResponse {
      results: Array<ApiResultItem>;
    }

    interface ApiResultItem {
      title: string;
      description?: string;
      explanation?: string;
    }

    this.readapi().then((apiKey: string) => {
      const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&q=${encodeURIComponent(query)}`;  
      fetch(apiUrl)
      .then((response: Response) => response.json())
      .then((data: ApiResponse) => { 
        console.log('Search results:', data);
        this.items = data.results.map((item: ApiResultItem) => ({
        title: item.title,
        description: item.description || item.explanation || 'No description available.'
        }));
      })
      .catch((error: unknown) => console.error('Error fetching search results:', error));
    });
  }

}
