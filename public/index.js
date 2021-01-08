app_id = "1133513"
key = "28637b4f7b1081ab57bc"
secret = "c8eb2404af10a0b4e3ed"
cluster = "mt1"
clientId = "W10PvBCKVg2oinNnnB6A90fAINOjv05s"
clientDomain = "dev-5ggnkfpn.us.auth0.com"
clientSecret = "n_LFA18xJAkXjS5VAtuImWQTcAO_tyOwbIzuL9Hb7xmy9eMg5x-CO46neALaaHjQ"
$(document).ready(function(){
    // Initiating our Auth0Lock
    let lock = new Auth0Lock(
        clientId,
        clientDomain,//example: lotus.auth0.com
        {
            auth: {
                params: {
                    scope: 'openid profile'
                }
            },
            autoclose: true,
            closable: false,
            rememberLastLogin: true
        }
    );

    let profile = JSON.parse(localStorage.getItem('profile'));
    let isAuthenticated = localStorage.getItem('isAuthenticated');

    function updateValues(userProfile, authStatus) {
        profile = userProfile;
        isAuthenticated = authStatus;
    }

    if(!isAuthenticated && !window.location.hash){
        lock.show();//show Lock widget
    }

    // Listening for the authenticated event
    lock.on("authenticated", function(authResult) {
        // Use the token in authResult to getUserInfo() and save it to localStorage
        lock.getUserInfo(authResult.accessToken, function(error, profile) {
            if (error) {
                // Handle error
                return;
            }

            localStorage.setItem('accessToken', authResult.accessToken);
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('isAuthenticated', true);
            updateValues(profile, true);
            $("#username").html(profile.name);
        });
    });
});
if(!isAuthenticated && !window.location.hash){
    lock.show();
}
else{

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher(secret, {
        cluster: cluster,
        encrypted: false
    });

    var channel = pusher.subscribe('private-chat');
    channel.bind('message-added', onMessageAdded);
}

function onMessageAdded(data) {
    let template = $("#new-message").html();
    template = template.replace("{{body}}", data.message);
    template = template.replace("{{name}}", data.name);

    $(".chat").append(template);
}
$('#btn-chat').click(function(){
    const message = $("#message").val();
    $("#message").val("");
        //send message
    $.post( "http://localhost:5000/message", { message, name: profile.name } );
});

$("#logout").click((e) => {
    e.preventDefault();
    logout();
});

function logout(){
    localStorage.clear();
    isAuthenticated = false;
    lock.logout({
        returnTo: "http://localhost:5000"
    });
}
$(document).ready(function(){
    // Initiating our Auth0Lock
    let lock = new Auth0Lock(
        clientId,
        clientDomain,
        {
            auth: {
                params: {
                    scope: 'openid profile'
                }
            },
            autoclose: true,
            closable: false,
            rememberLastLogin: true
        }
    );

    // Listening for the authenticated event
    lock.on("authenticated", function(authResult) {
        // Use the token in authResult to getUserInfo() and save it to localStorage
        lock.getUserInfo(authResult.accessToken, function(error, profile) {
            if (error) {
                // Handle error
                console.log(error);
                return;
            }

            localStorage.setItem('accessToken', authResult.accessToken);
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('isAuthenticated', true);
            updateAuthenticationValues(profile, true);
            $("#username").html(profile.name);
        });
    });

    let profile = JSON.parse(localStorage.getItem('profile'));
    let isAuthenticated = localStorage.getItem('isAuthenticated');

    function updateAuthenticationValues(userProfile, authStatus) {
        profile = userProfile;
        isAuthenticated = authStatus;
    }

    $("#logout").click((e) => {
        e.preventDefault();
        logout();
    });

    function logout(){
        localStorage.clear();
        isAuthenticated = false;
        lock.logout({
            returnTo: "http://localhost:5000"
        });
    }

    function onMessageAdded(data) {
        let template = $("#new-message").html();
        template = template.replace("{{body}}", data.message);
        template = template.replace("{{name}}", data.name);

        $(".chat").append(template);
    }

    if(!isAuthenticated && !window.location.hash){
        lock.show();
    }
    else{
        if(profile){
            $("#username").html(profile.name);
        }

        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        var pusher = new Pusher(secret, {
            cluster: cluster,
            encrypted: false
        });

        var channel = pusher.subscribe('private-chat');
        channel.bind('message-added', onMessageAdded);

        $('#btn-chat').click(function(){
            const message = $("#message").val();
            $("#message").val("");
                //send message
            $.post( "http://localhost:5000/message", { message, name: profile.name } );
        });  
    }
});