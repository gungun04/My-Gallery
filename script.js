document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    const deleteButtons = document.querySelectorAll('.delete-button');
    const sortByDateButton = document.getElementById('sort-by-date-button');
    const recycleBinContainer = document.querySelector('.recycle-bin');

    // Load favorites and deleted items from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let deletedItems = JSON.parse(localStorage.getItem('deletedItems')) || [];

    // Update UI based on favorites and deleted items
    function updateUI() {
        galleryItems.forEach(item => {
            const imgSrc = item.querySelector('img').src;

            // Handle favorites
            if (favorites.includes(imgSrc)) {
                item.querySelector('.favorite-button').classList.add('active');
            } else {
                item.querySelector('.favorite-button').classList.remove('active');
            }

            // Handle deletions
            if (deletedItems.includes(imgSrc)) {
                item.classList.add('hidden');
            } else {
                item.classList.remove('hidden');
            }
        });

        // Update recycle bin
        recycleBinContainer.innerHTML = '<h2>Recycle bin</h2>';
        deletedItems.forEach(src => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${src}" alt="Deleted Image">
                <button class="restore-button">&#9851;</button>
                <button class="permanent-delete-button">&#128465;</button>
            `;
            recycleBinContainer.appendChild(item);

            // Add event listeners to the buttons in the recycle bin
            item.querySelector('.restore-button').addEventListener('click', () => restoreItem(src));
            item.querySelector('.permanent-delete-button').addEventListener('click', () => permanentlyDeleteItem(src));
        });
    }

    updateUI();

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            if (filter === 'recycle-bin') {
                document.querySelector('.gallery').classList.add('hidden');
                recycleBinContainer.classList.remove('hidden');
            } else {
                document.querySelector('.gallery').classList.remove('hidden');
                recycleBinContainer.classList.add('hidden');

                galleryItems.forEach(item => {
                    const imgSrc = item.querySelector('img').src;

                    if (deletedItems.includes(imgSrc)) {
                        item.classList.add('hidden');
                        return;
                    }

                    if (filter === 'favorites') {
                        if (favorites.includes(imgSrc)) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    } else if (filter === 'All' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }
        });
    });

    // Favorite button functionality
    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const imgSrc = button.previousElementSibling.src;
            if (favorites.includes(imgSrc)) {
                favorites = favorites.filter(fav => fav !== imgSrc);
            } else {
                favorites.push(imgSrc);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateUI();
        });
    });

    // Delete button functionality
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const imgSrc = button.previousElementSibling.previousElementSibling.src;
            if (!deletedItems.includes(imgSrc)) {
                deletedItems.push(imgSrc);
            }
            localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
            updateUI();
        });
    });

    // Restore button functionality
    function restoreItem(src) {
        deletedItems = deletedItems.filter(item => item !== src);
        localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
        updateUI();
    }

    // Permanent delete button functionality
    function permanentlyDeleteItem(src) {
        deletedItems = deletedItems.filter(item => item !== src);
        localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
        // Note: In a real application, you would also remove the image file from storage

        updateUI();
    }

    // Sort by date functionality
    sortByDateButton.addEventListener('click', () => {
        const sortedItems = Array.from(galleryItems).sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            return dateA - dateB;
        });

        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = '';
        sortedItems.forEach(item => gallery.appendChild(item));
    });
});
