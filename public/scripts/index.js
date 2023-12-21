 document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      
      const result = await response.json();
      console.log(result);
      if (response.status === 200) {
        alert(result.message);
        window.location.href = './table.html';
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  });

  document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Заблокировать форму и отключить кнопку регистрации
    const registrationForm = document.getElementById('registrationForm');
    const registerButton = document.getElementById('registerButton'); // предположим, что у вас есть кнопка с id 'registerButton'
    
    registrationForm.classList.add('disabled'); // добавить класс, чтобы заблокировать стили
    registerButton.disabled = true; // отключить кнопку

    const regEmail = document.getElementById('email').value;
    const regPassword = document.getElementById('password').value;
    const regUsername = document.getElementById('username').value;

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: regEmail, password: regPassword, username: regUsername }),
      });

      const result = await response.json();

      if (response.status === 200) {
        alert(result.message);
      } else if(response.status === 400){

        alert(result.message);
      }else {
        alert(response.error)
      }
    } catch (error) {
      
      console.error('Ошибка при выполнении запроса:', error);
    } finally {
      registrationForm.classList.remove('disabled');
      registerButton.disabled = false;
    }
});