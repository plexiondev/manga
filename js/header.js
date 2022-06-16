// load header


document.getElementById('header').innerHTML =
(`
<span class="links">
    <ul>
    <li><a href="javascript:void(0)" onclick="history.back()"><i class="icon w-20" icon-name="arrow-left"></i>${TranslateString('GLOBAL_ACTION_BACK')}</a></li>
    <li><a href="javascript:void(0)" onclick="location.reload()"><i class="icon w-20" icon-name="repeat"></i>${TranslateString('GLOBAL_ACTION_RELOAD')}</a></li>
    </ul>
    <hr>
    <ul>
    <li><a href="/"><i class="icon w-20" icon-name="home"></i>${TranslateString('HEADER_ACTION_HOME')}</a></li>
    <li><a href="/search.html"><i class="icon w-20" icon-name="search"></i>${TranslateString('HEADER_ACTION_SEARCH')}</a></li>
    <li><a href="/tags.html"><i class="icon w-20" icon-name="tag"></i>Tags</a></li>
    <li><a href="/recent.html"><i class="icon w-20" icon-name="plus-circle"></i>Recent</a></li>
    </ul>
    <hr>
    <ul>
    <li><a href="/user.html?u=${localStorage.getItem('token_user_id')}"><i class="icon w-20" icon-name="contact"></i>Profile</a></li>
    <li><a href="/groups.html"><i class="icon w-20" icon-name="users"></i>Groups</a></li>
    <li><a href="/users.html"><i class="icon w-20" icon-name="user"></i>Users</a></li>
    </ul>
    <hr>
    <ul>
    <li><a href="/docs.html"><i class="icon w-20" icon-name="book"></i>Docs</a></li>
    <li><a href="https://github.com/plexiondev/manga"><i class="icon w-20" icon-name="external-link"></i>View Source</a></li>
    <li><a href="/settings"><i class="icon w-20" icon-name="settings"></i>Settings</a></li>
    </ul>
</span>
`);

// set top header info
document.getElementById('header-main').innerHTML =
(`
<span class="left"></span>
<span class="right">
    <a class="user-panel" href="/user.html?u=${localStorage.getItem('token_user_id')}">
        <span class="info">
            <h5>${localStorage.getItem('token_username')}</h5>
        </span>
        <span class="icon"></span>
    </a>
</span>
`)