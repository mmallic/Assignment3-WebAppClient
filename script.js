document.addEventListener('DOMContentLoaded', fetchMovies);

const movieForm = document.getElementById('movieForm');
const movieTable = document.getElementById('movieTable');

// Fetch movies from backend and display in table
function fetchMovies() {
    fetch ('https://movie-review-app.azurewebsites.net/api/movies')    // ('http://localhost:3000/movies')
        .then(response => response.json())
        .then(data => {
            movieTable.innerHTML = ''; // Clear table before adding new data
            data.forEach(movie => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td contenteditable="false">${movie.title}</td>
                    <td contenteditable="false">${movie.director}</td>
                    <td contenteditable="false">${movie.release_year}</td>
                    <td>
                        <button class="edit-btn" onclick="editRow(this, ${movie.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteMovie(${movie.id})">Delete</button>
                    </td>
                `;

                movieTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Add new movie
movieForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const director = document.getElementById('director').value;
    const release_year = document.getElementById('release_year').value;

    fetch ('https://movie-review-app.azurewebsites.net/api/movies', {        //('http://localhost:3000/movies'
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, director, release_year })
    })
    .then(response => response.json())
    .then(() => {
        movieForm.reset();
        fetchMovies(); // Refresh movie list
    })
    .catch(error => console.error('Error adding movie:', error));
});

// Delete a movie
function deleteMovie(id) {
    fetch(`https://movie-review-app.azurewebsites.net/api/movies/${id}`, {                 //http://localhost:3000/movies/${id}
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => fetchMovies()) // Refresh movie list
    .catch(error => console.error('Error deleting movie:', error));
}

// Edit a movie using inline editing
function editRow(button, id) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll('td[contenteditable]');

    if (button.innerText === 'Edit') {
        // Enable editing for all columns in the row
        cells.forEach(cell => cell.contentEditable = "true");
        button.innerText = 'Save';
        row.classList.add('editing');
    } else {
        // Disable editing and save the data
        const updatedData = {
            title: row.children[0].innerText,
            director: row.children[1].innerText,
            release_year: row.children[2].innerText
        };

        fetch(`https://movie-review-app.azurewebsites.net/api/movies/${id}`, {             //http://localhost:3000/movies/${id}
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(() => {
            cells.forEach(cell => cell.contentEditable = "false");
            button.innerText = 'Edit';
            row.classList.remove('editing');
            fetchMovies(); // Refresh the table after update
        })
        .catch(error => console.error('Error updating movie:', error));
    }
}
