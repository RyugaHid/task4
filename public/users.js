document.addEventListener('DOMContentLoaded', async function () {
  const response = await fetch('/users');
  const users = await response.json();
  const deleteButton = document.getElementById('deleteButton');
  const blockButton = document.getElementById('blockButton');
  const unblockButton = document.getElementById('unblockButton');
  const tableBody = document.getElementById('userTableBody');

  deleteButton.addEventListener('click', deleteSelectedUsers);
  blockButton.addEventListener('click', blockSelectedUsers);
  unblockButton.addEventListener('click', unblockSelectedUsers);

  async function deleteSelectedUsers() {
    const selectedUserCheckboxes = document.querySelectorAll('.userCheckbox:checked');
    for (const checkbox of selectedUserCheckboxes) {
      const userId = checkbox.dataset.userId;
      if (userId) {
        try {
          const response = await fetch(`/users/${userId}`, { method: 'DELETE' });
          if (response.ok) {
            const result = await response.json();
            console.log(result);
            if (result.redirectTo) {
              console.log('Редирект:', result.redirectTo);
              window.location.href = result.redirectTo;
            } else {
              location.reload();
            }
            console.log('Пользователь успешно удален:', result);
          } else {
            console.error('Ошибка при удалении пользователя:', response.statusText);
          }
        } catch (error) {
          console.error('Ошибка при обработке ответа:', error);
        }
      }
    }
  }

  async function blockSelectedUsers() {
    const selectedUserCheckboxes = document.querySelectorAll('.userCheckbox:checked');
    for (const checkbox of selectedUserCheckboxes) {
      const userId = checkbox.dataset.userId;
      if (userId) {
        try {
          const response = await fetch(`/users/block/${userId}`, { method: 'PUT' });

          if (response.ok) {
            const result = await response.json();
            console.log(result);
            if (result.redirectTo) {
              window.location.href = result.redirectTo;
            } else {
              location.reload();
            }
          } else {
            console.error('Ошибка при блокировке пользователя:', response.statusText);
          }
        } catch (error) {
          console.error('Ошибка при обработке ответа:', error);
        }
      }
    }
  }

  async function unblockSelectedUsers() {
    const selectedUserCheckboxes = document.querySelectorAll('.userCheckbox:checked');
    for (const checkbox of selectedUserCheckboxes) {
      const userId = checkbox.dataset.userId;
      if (userId) {
        try {
          const response = await fetch(`/users/unblock/${userId}`, { method: 'PUT' });

          if (response.ok) {
            const result = await response.json();
            console.log(result);
          } else {
            console.error('Ошибка при разблокировке пользователя:', response.statusText);
          }
        } catch (error) {
          console.error('Ошибка при обработке ответа:', error);
        }
      }
    }
    location.reload();
  }
});
