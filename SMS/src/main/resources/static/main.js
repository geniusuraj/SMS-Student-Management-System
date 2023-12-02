document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('student-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const studentData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            address: document.getElementById('address').value,
        };

        createStudent(studentData);
    });

    function createStudent(data) {
        fetch('api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(student => {
            addStudentToGrid(student);
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add student: ' + error.message);
        });
    }

    function addStudentToGrid(student) {
    const tableBody = document.getElementById('students-grid').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    newRow.setAttribute('data-student-id', student.id);

    newRow.innerHTML = `
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.phone}</td>
        <td>${student.dob}</td>
        <td>${student.gender}</td>
        <td>${student.address}</td>
        <td>
            <button onclick="editStudent(${student.id})">Edit</button>
            <button onclick="deleteStudent(${student.id})">Delete</button>
        </td>
    `;
}

    
function editStudent(studentId) {
    const studentData = {
        id: studentId,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value,
    };

    fetch(`api/students/${studentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(updatedStudent => {
        console.log('Student updated:', updatedStudent);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update student: ' + error.message);
    });
}

function deleteStudent(studentId) {
    fetch(`api/students/${studentId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
        if (row) {
            row.remove();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete student: ' + error.message);
    });
}

});
