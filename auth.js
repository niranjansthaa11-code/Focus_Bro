//for showing up of hte login modal if not logged in 
async function initAuth() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
        showAuthModal(); //if there is no session it calls showatuth model fxn and shows the login signupform 
    } else {
        document.getElementById('user-email').textContent = session.user.user_metadata?.full_name || session.user.email;
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
            <input type="text" id="auth-fullname" placeholder="Full Name" style="display:none;"/>
            <input type="email" id="auth-email" placeholder="Email" />
            <input type="password" id="auth-password" placeholder="Password" />
            <div id="auth-error" style="color:red; font-size:0.8rem; display:none;"></div>
            <button id="auth-submit">Login</button>
            <button type="button" id="forgot-password-link" class="auth-forgot-link">Forgot Password?</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('forgot-password-link').addEventListener('click', () => {
        showForgotPasswordModal();
    });
    //for knowing if the auth is in signup mode or the login mode also to change betweeen login and sign up tab 
    let mode = 'login';
    let otpMode = false;
    let pendingEmail = '';
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
        errorDiv.style.display = 'none';

        //adding the otp verification steps
        if (otpMode) {
            const otp = document.getElementById('auth-otp').value.trim();
            const { error } = await sb.auth.verifyOtp({
                email: pendingEmail,
                token: otp,
                type: 'signup'
            });
            if (error) {
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
            } else {
                modal.remove(); //removes the modal element enitrely hai 
                location.reload();
                document.getElementById('user-email').textContent = pendingEmail;
            }
            return;
        }


        //calss the supabase authentication function 
        let result;
        if (mode === 'login') {
            result = await sb.auth.signInWithPassword({ email, password });
            if (result.error) {
                errorDiv.textContent = result.error.message;
                errorDiv.style.display = 'block';
            } else {
                location.reload();
                document.getElementById('user-email').textContent = email;
            }
        } else {
            result = await sb.auth.signUp({ email, password });
            if (result.error) {
                errorDiv.textContent = result.error.message;
                errorDiv.style.display = 'block';
            } else {
                const fullName = document.getElementById('auth-fullname').value.trim();
                if (!fullName) {
                    errorDiv.textContent = 'Please enter your full name.';
                    errorDiv.style.display = 'block';
                    return;
                }
                result = await sb.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName } //stores the data in the database 
                    }
                });
                if (result.error) {
                    errorDiv.textContent = result.error.message;
                    errorDiv.style.display = "block";
                } else {
                    //signup greny ui chahi otp entry ma shiftt hunxw aba 
                    pendingEmail = email;
                    otpMode = true;
                    document.getElementById('auth-email').style.display = 'none';
                    document.getElementById('auth-password').style.display = 'none';
                    document.querySelector('.auth-tabs').style.display = 'none';

                    //otp rakhney thau banauney
                    const otpInput = document.createElement('input');
                    otpInput.type = 'text';
                    otpInput.id = 'auth-otp';
                    otpInput.placeholder = 'Enter 8 digit code from your given email.';
                    otpInput.maxLength = 20;
                    otpInput.style.letterSpacing = '0.3em';
                    otpInput.style.textAlign = 'center';
                    otpInput.style.fontSize = '0.5rem';

                    //for telling where the otp was sent 
                    const otpNote = document.createElement('p');
                    otpNote.style.cssText = 'font-size:0.78rem; color:rgba(255,255,255,0.35); text-align:center;';
                    otpNote.textContent = `Code send to ${email}`;

                    //submit btn thing 
                    const submitBtn = document.getElementById('auth-submit');
                    submitBtn.parentElement.insertBefore(otpNote, submitBtn);
                    submitBtn.parentElement.insertBefore(otpInput, submitBtn);
                    submitBtn.textContent = 'Verify Code';
                    otpInput.focus();//to make input box active jassly chahi user la8i xoito otp add grna help garxw 

                }
            }
        }
    });
}

initAuth();


///for the logout btn that is in the nav bar section 
document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault(); //prevents from acting as href
    await sb.auth.signOut(); // request grxw supra lai signout grnaaa...........
    location.reload();
});

//password change grney button hai 
document.getElementById('change-password-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showChangePasswordModal();
});

function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.id = 'password-modal'
    modal.innerHTML = `
    <div class="auth-box">
        <h2 class="auth-title">Change Password</h2>
        <p class="auth-sub">Enter a new password for your account</p>
        <input type="password" id="new-password" placeholder="New Password" />
        <input type="password" id="confirm-password" placeholder="Confirm New Password" />
        <div id="password-error" class="auth-error-msg"></div>
        <div id="password-success" class="auth-success-msg"></div>
        <button id="password-submit">Update Password</button>
        <button id="password-cancel" class="auth-cancel-btn">Cancel</button>
    </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('password-cancel').addEventListener('click', () => modal.remove());
    document.getElementById('password-submit').addEventListener('click', async () => {
        const newPass = document.getElementById('new-password').value.trim();
        const confirmPass = document.getElementById('confirm-password').value.trim();
        const errorDiv = document.getElementById('password-error');
        const successDiv = document.getElementById('password-success');
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';


        //password 6 ota length vanda thulo halna vanney 
        if (newPass.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters.';
            errorDiv.style.display = 'block';
            return;
        }
        if (newPass !== confirmPass) {
            errorDiv.textContent = 'Passwords do not match.';
            errorDiv.style.display = 'block';
            return;
        }
        //supabase verify thing 
        const { error } = await sb.auth.updateUser({ password: newPass });
        if (error) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        } else {
            successDiv.textContent = 'Password updated successfully!';
            successDiv.style.display = 'block';
            setTimeout(() => modal.remove(), 1500);
        }

    });


}



///for forgot password kind of thing when user forgots the password 

function showForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.id = 'forgot-modal';
    //forgot password modal in the login paag e
    modal.innerHTML = `
    <div class="auth-box">
        <h2 class="auth-title">Reset Password</h2>
        <p class="auth-sub">Enter your email Sathi  and we'll send you a reset link</p>
        <input type="email" id="forgot-email" placeholder="Email" />
        <div id="forgot-error" class="auth-error-msg"></div>
        <div id="forgot-success" class="auth-success-msg"></div>
        <button id="forgot-submit">Send Reset Link</button>
        <button id="forgot-cancel" class="auth-cancel-btn">Cancel</button>
    </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('forgot-cancel').addEventListener('click', () => modal.remove());

    document.getElementById('forgot-submit').addEventListener('click', async () => {
        const email = document.getElementById('forgot-email').value.trim();
        const errorDiv = document.getElementById('forgot-error');
        const successDiv = document.getElementById('forgot-success');
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';

        if (!email) {
            //makee the user input emai l
            errorDiv.textContent = 'Please enter your email.';
            errorDiv.style.display = 'block';
            return;
        }

        //yesley chahi supabase lai redirect grna help garxw ....
        const { error } = await sb.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html'
        });

        if (error) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        } else {
            successDiv.textContent = 'Check your email for a reset link!';
            successDiv.style.display = 'block';
        }
    });
}