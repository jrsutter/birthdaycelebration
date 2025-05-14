function createBalloons() {
    const container = document.getElementById('balloons');
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(balloon);
    }
}


// Function to read and parse CSV file and display birthdays
function loadBirthdays() {
    const filePath = 'birthdays.csv'; // CSV file path

    Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function(results) {
            const birthdays = results.data;
            const currentBirthday = [];
            const pastBirthday = [];
            const upcomingBirthday = [];

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize time for accurate date comparison

            birthdays.forEach(birthday => {
                if (!birthday.birthdate) return; // Skip empty rows

                const birthDate = new Date(birthday.birthdate);
                const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                birthdayThisYear.setHours(0, 0, 0, 0);

                const diffDays = Math.floor((birthdayThisYear - today) / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                    currentBirthday.push(birthday);
                } else if (diffDays > -5 && diffDays < 0) {
                    pastBirthday.push(birthday);
                } else if (diffDays > 0 && diffDays <= 5) {
                    upcomingBirthday.push(birthday);
                }
            });

            displayBirthdays(currentBirthday, pastBirthday, upcomingBirthday);

            // Only show confetti if there's a birthday in range
            if (currentBirthday.length || pastBirthday.length || upcomingBirthday.length) {
                createConfetti();
            }
        }
    });
}

// Function to display birthdays in their respective sections
function displayBirthdays(currentBirthday, pastBirthday, upcomingBirthday) {
    const currentBirthdaySection = document.getElementById('current-birthdays');
    const pastBirthdaySection = document.getElementById('past-birthdays');
    const upcomingBirthdaySection = document.getElementById('upcoming-birthdays');

    if (currentBirthday.length > 0) {
        currentBirthday.forEach(b => {
            currentBirthdaySection.innerHTML += `<p>${b.first_name} (${b.class_period})</p>`;
        });
    } else {
        currentBirthdaySection.innerHTML = '<p>No Birthdays Today</p>';
    }

    pastBirthday.forEach(b => {
        pastBirthdaySection.innerHTML += `<p>${b.first_name} (${b.class_period}) - ${new Date(b.birthdate).toLocaleDateString()}</p>`;
    });

    upcomingBirthday.forEach(b => {
        upcomingBirthdaySection.innerHTML += `<p>${b.first_name} (${b.class_period}) - ${new Date(b.birthdate).toLocaleDateString()}</p>`;
    });
}

// Function to refresh the page at midnight
function refreshAtMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const timeUntilMidnight = midnight - now;

    setTimeout(() => {
        location.reload();
    }, timeUntilMidnight);
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBirthdays();
    refreshAtMidnight();
});
