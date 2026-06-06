//for showing up of hte login modal if not logged in 
async function initAuth() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
        showAuthModal(); //if there is no session it calls showatuth model fxn and shows the login signupform 
    } else {
        document.getElementById('user-email').textContent = session.user.email;
    }
}
function showAuthModal() {
    document.querySelector('.main').style.display = 'none';
    document.getElementById('sidebar').style.display = 'none';
    //hiding of the main contenet and the sidebar 

    //this has created a div with the id auth-modal
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    //we are createing the html for the preauthorization 
    modal.innerHTML = `
    <div class ="auth-box">
    <h2 class="auth-title"> Focus Sathi </h2> 
    <p class="auth-sub">Your Personal Tasks Manager </p>
            <div class="auth-tabs">
                <button class="auth-tab active" id="tab-login">Login</button>
                <button class="auth-tab" id="tab-signup">Sign Up</button>
            </div>
            <input type="email" id="auth-email" placeholder="Email" />
            <input type="password" id="auth-password" placeholder="Password" />
            <div id="auth-error" style="color:red; font-size:0.8rem; display:none;"></div>
            <button id="auth-submit">Login</button>
        </div>
    `;
    document.body.appendChild(modal);
    //for knowing if the auth is in signup mode or the login mode also to change betweeen login and sign up tab 
    let mode = 'login';
    document.getElementById('tab-login').addEventListener('click', () => {
        mode = 'login';
        document.getElementById('auth-submit').textContent = 'Login';
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('tab-signup').classList.remove('active');

    });
    document.getElementById('tab-signup').addEventListener('click', () => {
        mode = 'signup';
        document.getElementById('auth-submit').textContent = 'Sign Up';
        document.getElementById('tab-signup').classList.add('active');
        document.getElementById('tab-login').classList.remove('active');
    });
    document.getElementById('auth-submit').addEventListener('click', async () => {
        //user ley submit dabda email password lai linxww 
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value.trim();
        const errorDiv = document.getElementById('auth-error');

        //calss the supabase authentication function 
        let result;
        if (mode === 'login') {
            result = await sb.auth.signInWithPassword({ email, password });
        } else {
            result = await sb.auth.signUp({ email, password });
        }

        if (result.error) {
            errorDiv.textContent = result.error.message;
            errorDiv.style.display = 'block';
        } else {
            //removes the login bar and make the main site visible
            modal.remove();
            document.querySelector('.main').style.display = '';
            document.getElementById('sidebar').style.display = '';
            document.getElementById('user-email').textContent = email;
        }
    });
}

initAuth();


///for the logout btn that is in the nav bar section 
document.getElementById('logout-btn')?.addEventListener('click',async (e)=>{
    e.preventDefault(); //prevents from acting as href
    await sb.auth.signOut(); // request grxw supra lai signout grnaaa...........
    location.reload();
});