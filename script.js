document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    let currentIndex = 0;
    let loggedInUser = null;
   
    
     const fetchTestimonials = () => {
        fetch('http://localhost:3000/testimonials')
            .then(response => response.json())
            .then(testimonials => displayTestimonials(testimonials))
            .catch(error => console.error('Error fetching testimonials:', error));
    };

    
    const displayTestimonials = (testimonials) => {
        const testimonialsList = document.getElementById('testimonials-list');
        testimonialsList.innerHTML = '';
        testimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
        testimonials.forEach(testimonial => {
            const testimonialCard = document.createElement('div');
            testimonialCard.className = 'testimonial-card';
            testimonialCard.innerHTML = `
                <p><strong>${testimonial.userName}</strong> (${testimonial.date}):</p>
                <p>${testimonial.text}</p>
                <p>Rating: ${testimonial.rating} / 5</p>
            `;
            testimonialsList.appendChild(testimonialCard);
        });
    };


    fetchTestimonials();

  
    const submitTestimonialForm = document.getElementById('submitTestimonialForm');
    submitTestimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!loggedInUser) {
            alert('Please login to submit a testimonial.');
            return;
        }

        const text = document.getElementById('testimonialText').value;
        const rating = document.getElementById('testimonialRating').value;

        
        fetch('http://localhost:3000/testimonials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: loggedInUser.id,
                userName: loggedInUser.email,
                text,
                rating,
                date: new Date().toISOString().split('T')[0],
            }),
        })
            .then(response => response.json())
            .then(() => {
                document.getElementById('testimonialText').value = '';
                document.getElementById('testimonialRating').value = '';
                fetchTestimonials(); 
            })
            .catch(error => console.error('Error submitting testimonial:', error));
    });
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

    const searchButton = document.getElementById('searchButton');
    const propertiesList = document.getElementById('properties-list');
    const propertyModal = document.getElementById('propertyModal');
    const closeModal = document.querySelector('.modal .close');

    function fetchProperties() {
        fetch('http://localhost:3000/properties')
        .then(response => response.json())
        .then(properties => {
            const propertiesList = document.getElementById('properties-list');
            propertiesList.innerHTML = '';
            properties.forEach(property => {
                const propertyCard = document.createElement('div');
                propertyCard.className = 'property-card';
                propertyCard.innerHTML = `
                    <img src="${property.image}" alt="${property.name}">
                    <h3>${property.name}</h3>
                    <p>Location: ${property.location}</p>
                    <p>Price: ksh${property.price}</p>
                    <p>Type: ${property.type}</p>
                    <button data-id="${property.id}">View</button>
                `;
                propertiesList.appendChild(propertyCard);
            });

            document.querySelectorAll('.property-card button').forEach(button => {
                button.addEventListener('click', event => {
                    if (!loggedInUser) {
                        alert('Please login to view the property details.');
                        return;
                    }
                    const propertyId = event.target.getAttribute('data-id');
                    fetch(`http://localhost:3000/properties/${propertyId}`)
                        .then(response => response.json())
                        .then(property => {
                            document.getElementById('propertyName').innerText = property.name;
                            document.getElementById('propertyLocation').innerText = `Location: ${property.location}`;
                            document.getElementById('propertyPrice').innerText = `Price: ksh${property.price}`;
                            document.getElementById('propertyType').innerText = `Type: ${property.type}`;
                            document.getElementById('propertyImage').src = property.image;
                            document.getElementById('propertyOwnerPhone').innerText = `Phone: ${property.ownerPhone}`;
                            document.getElementById('propertyOwnerEmail').innerText = `Email: ${property.ownerEmail}`;
                            document.getElementById('propertyModal').style.display = 'block';
                        });
                });
            });
        });
    }

    function displayProperties(properties) {
        const propertiesList = document.getElementById('properties-list');
        propertiesList.innerHTML = '';
        properties.forEach(property => {
            const propertyCard = document.createElement('div');
            propertyCard.className = 'property-card';
            propertyCard.innerHTML = `
                <img src="${property.image}" alt="${property.name}">
                <h3>${property.name}</h3>
                <p>Location: ${property.location}</p>
                <p>Price: ksh${property.price}</p>
                <p>Type: ${property.type}</p>
                <button data-id="${property.id}">View</button>
            `;
            propertiesList.appendChild(propertyCard);
        });

        document.querySelectorAll('.property-card button').forEach(button => {
            button.addEventListener('click', event => {
                if (!loggedInUser) {
                    alert('Please login to view the property details.');
                    return;
                }
                const propertyId = event.target.getAttribute('data-id');
                fetch(`http://localhost:3000/properties/${propertyId}`)
                    .then(response => response.json())
                    .then(property => {
                        document.getElementById('propertyName').innerText = property.name;
                        document.getElementById('propertyLocation').innerText = `Location: ${property.location}`;
                        document.getElementById('propertyPrice').innerText = `Price: ksh${property.price}`;
                        document.getElementById('propertyType').innerText = `Type: ${property.type}`;
                        document.getElementById('propertyImage').src = property.image;
                        document.getElementById('propertyOwnerPhone').innerText = `Phone: ${property.ownerPhone}`;
                        document.getElementById('propertyOwnerEmail').innerText = `Email: ${property.ownerEmail}`;
                        document.getElementById('propertyModal').style.display = 'block';
                    });
            });
        });
    }

    searchButton.addEventListener('click', () => {
        const priceRange = document.getElementById('priceRange').value;
        const propertyType = document.getElementById('propertyType').value;
        const propertyLocation = document.getElementById('propertyLocation').value.toLowerCase(); // Get location input
    
        fetch('http://localhost:3000/properties')
            .then(response => response.json())
            .then(data => {
                let filteredProperties = data;
                if (priceRange) {
                    const [minPrice, maxPrice] = priceRange.split('-').map(Number);
                    filteredProperties = filteredProperties.filter(property => property.price >= minPrice && property.price <= maxPrice);
                }
                if (propertyType) {
                    filteredProperties = filteredProperties.filter(property => property.type === propertyType);
                }
                if (propertyLocation) {
                    filteredProperties = filteredProperties.filter(property => property.location.toLowerCase().includes(propertyLocation));
                }
                displayProperties(filteredProperties);
            });
    });
    
    closeModal.addEventListener('click', () => {
        propertyModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == propertyModal) {
            propertyModal.style.display = 'none';
        }
    });

  
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('loginModal');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormElement = loginForm.querySelector('form');
    const signupFormElement = signupForm.querySelector('form');

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    showSignup.addEventListener('click', () => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });

    showLogin.addEventListener('click', () => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.email === email && user.password === password);
                if (user) {
                    alert('Login successful');
                    loggedInUser = user;
                    loginModal.style.display = 'none';
                    loginBtn.style.display = 'none';
                    const userName = document.createElement('span');
                    userName.textContent = user.email;
                    document.querySelector('.navbar').appendChild(userName);
                } else {
                    alert('Invalid email or password');
                }
            });
    });

    signupFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(user => {
                alert('Signup successful');
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
            });
    });

    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
    });
    

    fetchProperties();
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const contactData = {
        name: name,
        email: email,
        message: message
    };

    fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Your message has been sent successfully!');
        document.getElementById('contactForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again later.');
    });
});