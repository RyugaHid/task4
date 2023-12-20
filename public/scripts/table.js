document.addEventListener('DOMContentLoaded', async function (){
  const tableBody = document.getElementById('userTableBody');
  const response = await fetch('/users');
  const users = await response.json();

  function formatDateString(dateString) {
    const dateObject = new Date();

    
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };
  
    const formattedDate = dateObject.toLocaleDateString('en-US', options);
    return formattedDate;
  }

  const tableHeader = document.querySelector('thead tr');
  const selectAllCheckboxHeader = document.createElement('th');
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.id = 'selectAllCheckbox';
  selectAllCheckbox.className = 'selectAllCheckbox';
  selectAllCheckboxHeader.appendChild(selectAllCheckbox);
  tableHeader.insertBefore(selectAllCheckboxHeader, tableHeader.firstChild);

  // Добавьте обработчик событий для чекбокса "Выбрать все"
  selectAllCheckbox.addEventListener('change', function () {
    const userCheckboxes = document.querySelectorAll('.userCheckbox');

    userCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  users.forEach(user => {
    const row = document.createElement('tr');

    const checkboxCell = document.createElement('td');
    const userCheckbox = document.createElement('input');
    userCheckbox.type = 'checkbox';
    userCheckbox.className = 'userCheckbox';
    userCheckbox.dataset.userId = user.username;
    checkboxCell.appendChild(userCheckbox);
    row.appendChild(checkboxCell);

    row.innerHTML += `<td>${user.username}</td><td>${user.email}</td><td>${user.status}</td><td>${user._id}</td><td>${formatDateString(user.lastlogin)}</td><td>${formatDateString(user.registrationdate)}</td>`;

    tableBody.appendChild(row);
  });
});
