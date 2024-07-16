document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    let currentIndex = 0;

    function showSlide(index) {
        const totalSlides = slides.children.length;
        if (index >= totalSlides) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalSlides - 1;
        } else {
            currentIndex = index;
        }
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prev.addEventListener('click', () => {
        showSlide(currentIndex - 1);
    });

    next.addEventListener('click', () => {
        showSlide(currentIndex + 1);
    });


    setInterval(() => {
        showSlide(currentIndex + 1);
    }, 3000);

   
    fetch('http://localhost:3000/properties')
        .then(response => response.json())
        .then(data => {
            const propertiesList = document.getElementById('properties-list');
            data.forEach(property => {
                const propertyCard = document.createElement('div');
                propertyCard.className = 'property-card';
                propertyCard.innerHTML = `
                    <img src="${property.image}" alt="${property.name}">
                    <h3>${property.name}</h3>
                    <p>Location: ${property.location}</p>
                    <p>Price: ${property.price}</p>
                    <p>Type: ${property.type}</p>
                `;
                propertiesList.appendChild(propertyCard);
            });
        });

 
    document.getElementById('searchButton').addEventListener('click', () => {
        const location = document.querySelector('.search-bar input').value.toLowerCase();
        const priceRange = document.getElementById('priceRange').value;
        const propertyType = document.getElementById('propertyType').value;

        fetch('http://localhost:3000/properties')
            .then(response => response.json())
            .then(data => {
                const filteredProperties = data.filter(property => {
                    const matchesLocation = property.location.toLowerCase().includes(location);
                    const matchesType = property.type === propertyType || propertyType === '';
                    let matchesPrice = true;

                    if (priceRange) {
                        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
                        const propertyPrice = Number(property.price.replace(/\D/g, ''));

                        if (maxPrice) {
                            matchesPrice = propertyPrice >= minPrice && propertyPrice <= maxPrice;
                        } else {
                            matchesPrice = propertyPrice >= minPrice;
                        }
                    }

                    return matchesLocation && matchesType && matchesPrice;
                });

                const propertiesList = document.getElementById('properties-list');
                propertiesList.innerHTML = '';
                filteredProperties.forEach(property => {
                    const propertyCard = document.createElement('div');
                    propertyCard.className = 'property-card';
                    propertyCard.innerHTML = `
                        <img src="${property.image}" alt="${property.name}">
                        <h3>${property.name}</h3>
                        <p>Location: ${property.location}</p>
                        <p>Price: ${property.price}</p>
                        <p>Type: ${property.type}</p>
                    `;
                    propertiesList.appendChild(propertyCard);
                });
            });
    });
});
