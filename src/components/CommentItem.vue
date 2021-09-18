<template>
     <van-cell>
          <div class="user">
            <img :src="reply.avatar" alt="">
            <span class="nick-name">{{ reply.nickname }}</span>
            <van-rate v-model="reply.product_score" readonly size="14"/>
          </div>
          <div class="user-comments">
            <div class="comments-top"> {{ reply.add_time }} {{ reply.sku }} </div>
            <p class="content">{{ reply.comment }}</p>
            <ul class="comment-imgs">
              <li v-for="(item, index) in imgs" :key="index" >
                  <img :src="item" alt="">
              </li>
            </ul>
          </div>
        </van-cell>
</template>

<script>
export default {
    props: {
        reply: {
            type: Object,
            required: true
        }
    },
    computed: {
      imgs () {
        if (this.reply.cart_info) {
          return this.reply.cart_info.productInfo.slider_image
        } else {
          return this.reply.pics
        }
      }
    }
}
</script>

<style lang="scss" scoped>
    .user {
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
      .nick-name {
        margin: 0 10px;
      }
    }
    .user-comments {
      .comment-imgs {
        overflow: hidden;

        li {
          box-sizing: border-box;
          float: left;
          width: 25%;
          
          padding: 0 6px 6px 0;
          img {
            display: block;
            width: 100%;
          }
        }
      }
    }
</style>
