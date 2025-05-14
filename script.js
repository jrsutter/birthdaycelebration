// Function to create animated balloons
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

// Function to show a birthday banner
function showBirthdayBanner(birthdayList) {
    const banner = document.getElementById('birthday-banner');
    if (birthdayList.length > 0) {
        const nameList = birthdayList.map(b => b.first_name).join(', ');
        banner.innerText = `🎉 Happy Birthday ${nameList}! 🎉`;
    }
}

// Function to read and parse CSV file and display birthdays
function loadBirthdays() {
    const filePath = 'birthdays.csv';

    Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function(results) {
            const birthdays = results.data;
            const currentBirthday = [];
            const pastBirthday = [];
            const upcomingBirthday = [];

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize time

            birthdays.forEach(birthday => {
                if (!birthday.birthdate) return;

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

            const allBirthdays = [...currentBirthday, ...pastBirthday, ...upcomingBirthday];
            if (allBirthdays.length > 0) {
                showBirthdayBanner(allBirthdays);
                createBalloons();
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadBirthdays();
    refreshAtMidnight();
});
