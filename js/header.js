// load header


document.getElementById('header').innerHTML =
(`
<span class="links">
    <ul>
    <li><a href="javascript:void(0)" onclick="history.back()"><i class="icon w-20" data-feather="arrow-left"></i>Back</a></li>
    <li><a href="javascript:void(0)" onclick="location.reload()"><i class="icon w-20" data-feather="repeat"></i>Reload</a></li>
    </ul>
    <hr>
    <ul>
    <li><a href="/"><i class="icon w-20" data-feather="home"></i>Home</a></li>
    <li><a href="/search.html"><i class="icon w-20" data-feather="search"></i>Search</a></li>
    <li><a href="/tags.html"><i class="icon w-20" data-feather="tag"></i>Tags</a></li>
    <li><a href="/recent.html"><i class="icon w-20" data-feather="plus-circle"></i>Recent</a></li>
    </ul>
    <hr>
    <ul>
    <li><a href="/user.html?u=${localStorage.getItem('token_user_id')}"><i class="icon w-20" data-feather="user"></i>Profile</a></li>
    <li><a href="/groups.html"><i class="icon w-20" data-feather="users"></i>Groups</a></li>
    <li><a href="/users.html"><i class="icon w-20" data-feather="user"></i>Users</a></li>
    </ul>
    <hr>
    <ul>
    <li><a href="/docs.html"><i class="icon w-20" data-feather="book"></i>Docs</a></li>
    <li><a href="https://github.com/plexiondev/manga"><i class="icon w-20" data-feather="external-link"></i>View Source</a></li>
    <li><a href="/settings"><i class="icon w-20" data-feather="settings"></i>Settings</a></li>
    </ul>
</span>
`);