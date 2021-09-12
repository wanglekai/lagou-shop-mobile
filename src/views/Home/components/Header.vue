<template>
    <header>
        <img height="30" src="@/assets/logo.png" alt="logo" />
        <div class="search">
            <van-icon name="search" size=".6rem" />
        </div>
        <van-icon name="wap-nav" size=".8rem" />
    </header>
</template>
<style scoped lang="scss">
header {
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    height: 50px;
    align-items: center;
    background-color: #fff;
    .search {
        width: 100%;
        height: 30px;
        padding-left: 5px;
        background-color: #e4e4e4;
        border-radius: 25px;
        display: flex;
        align-items: center;
    }
}
</style>
