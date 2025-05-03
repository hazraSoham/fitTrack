<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login to Keycloak</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<div class="container">
    <div class="left-panel">
        <img src="logo.png" alt="Hot Air Balloon" class="balloon-image">
    </div>
    <div class="right-panel">
        <h2>Create your Free Account</h2>
        <form action="${url.loginAction}" method="post">
            <input type="text" id="username" name="username" placeholder="Enter your Full Name here" value="${username}">
            <input type="password" id="password" name="password" placeholder="Enter your Password here">
            <button type="submit">Create Account</button>
        </form>

        <p>Already have an account? <a href="${url.loginUrl}">Log in</a></p>

        <div class="divider">- OR -</div>

        <div class="social-login">
            <button class="google-button">Sign up with Google</button>
            <button class="github-button">Sign up with GitHub</button>
        </div>

        <footer>
            Reserved directs to Leo Barreto
        </footer>
    </div>
</div>

</body>
</html>
