document.getElementById('reset-submit').addEventListener('click', async () => {

    //taking const values fromn html
    const newPass = document.getElementById('reset-new-password').value.trim();
    const confirmPass = document.getElementById('reset-confirm-password').value.trim();
    const errorDiv = document.getElementById('reset-error');
    const successDiv = document.getElementById('reset-success');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    //condition lagayeko if the person have entered length less than 6
    if (newPass.length < 6
    ) {
        errorDiv.textContent = 'Password must be atleast 6 Characters Brother'
        errorDiv.style.display = 'block';
        return;
    }


    //if passwrod is not matching properly then display erro r logic
    if (newPass !== confirmPass) {
        errorDiv.textContent = "Password isn't Matching brother ....";
        errorDiv.style.display = 'block';
        return;
    }

    if (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';

    } else {
        successDiv.textContent = 'Password is Updated Sucessfully! Redirecting you to login ......';
        successDiv.style.display = 'block';
        setTimeout(() => {
            window.location.href = 'index.html'//for transfering it to the real dashboard 
        }, 2000);
    }

});