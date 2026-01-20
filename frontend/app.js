class AuthApp {
    constructor() {
        this.baseUrl = 'http://localhost:3000/app'; 
        this.currentView = 'auth'; 
        this.init();
    }

    init() {
        this.renderAuthView();
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    async checkAuthStatus() {

    }

    renderAuthView() {
        const authContainer = document.getElementById('auth-container');
        authContainer.innerHTML = `
            <div class="tabs">
                <button class="tab-button active" data-tab="login">Вход</button>
                <button class="tab-button" data-tab="register">Регистрация</button>
            </div>
            
            <div id="login-form" class="form-tab active">
                <div class="form-container">
                    <div class="form-group">
                        <label for="login-username">Логин:</label>
                        <input type="text" id="login-username" placeholder="Введите логин">
                    </div>
                    <div class="form-group">
                        <label for="login-password">Пароль:</label>
                        <input type="password" id="login-password" placeholder="Введите пароль">
                    </div>
                    <button id="login-btn">Войти</button>
                    <div id="login-error" class="error-message"></div>
                    <div id="login-success" class="success-message"></div>
                </div>
            </div>
            
            <div id="register-form" class="form-tab">
                <div class="form-container">
                    <div class="form-group">
                        <label for="register-username">Логин:</label>
                        <input type="text" id="register-username" placeholder="Придумайте логин">
                    </div>
                    <div class="form-group">
                        <label for="register-password">Пароль:</label>
                        <input type="password" id="register-password" placeholder="Придумайте пароль">
                    </div>
                    <button id="register-btn">Зарегистрироваться</button>
                    <div id="register-error" class="error-message"></div>
                    <div id="register-success" class="success-message"></div>
                </div>
            </div>
        `;
    }

    renderProfileView(user) {
        const profileContainer = document.getElementById('profile-container');
        profileContainer.innerHTML = `
            <div class="profile-info">
                <h2>Добро пожаловать!</h2>
                <p><strong>Логин:</strong> ${user.login}</p>
                <p><strong>Статус:</strong> <span style="color: green;">● Онлайн</span></p>
            </div>
            <button id="logout-btn">Выйти</button>
        `;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                this.switchTab(e.target.dataset.tab);
            }
            
            if (e.target.id === 'register-btn') {
                this.register();
            }
            
            if (e.target.id === 'login-btn') {
                this.login();
            }
            
            if (e.target.id === 'logout-btn') {
                this.logout();
            }
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        document.querySelectorAll('.form-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-form`).classList.add('active');
    }

    async register() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const errorDiv = document.getElementById('register-error');
        const successDiv = document.getElementById('register-success');

        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';

        if (!username || !password) {
            errorDiv.textContent = 'Пожалуйста, заполните все поля';
            errorDiv.style.display = 'block';
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/regUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: username,
                    password: password,
                    online: true
                })
            });

            const data = await response.json();

            if (data.status) {
                successDiv.textContent = data.message;
                successDiv.style.display = 'block';
                
                document.getElementById('register-username').value = '';
                document.getElementById('register-password').value = '';
                
                setTimeout(() => {
                    this.switchTab('login');
                    document.getElementById('login-username').value = username;
                    successDiv.style.display = 'none';
                }, 2000);
            } else {
                errorDiv.textContent = data.message || 'Ошибка регистрации';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            errorDiv.textContent = 'Ошибка соединения с сервером';
            errorDiv.style.display = 'block';
        }
    }

    
async login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    const successDiv = document.getElementById('login-success');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (!username || !password) {
        errorDiv.textContent = 'Пожалуйста, заполните все поля';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${this.baseUrl}/authUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.status) {
            localStorage.setItem('token', data.token);

            localStorage.setItem('user', JSON.stringify(data.user))
            
            successDiv.textContent = data.message || 'Успешный вход!';
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                this.showProfile(data.user);
            }, 1000);
        } else {
            errorDiv.textContent = data.message || 'Неверный логин или пароль';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        errorDiv.textContent = 'Ошибка соединения с сервером';
        errorDiv.style.display = 'block';
    }
}

    async logout() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token')
            
            await fetch(`${this.baseUrl}/logoutUser`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: user.login,
                    online: false
                })
            });

            localStorage.removeItem('user');

            localStorage.removeItem('token')

            this.showAuth();
        } catch (error) {
            console.error('Ошибка выхода:', error);
            this.showAuth();
        }
    }

    showProfile(user) {
        this.renderProfileView(user);
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('profile-container').classList.remove('hidden');
    }

    showAuth() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('profile-container').classList.add('hidden');
        this.switchTab('login');
        
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('register-username').value = '';
        document.getElementById('register-password').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthApp();
});