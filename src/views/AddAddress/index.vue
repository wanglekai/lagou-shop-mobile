<template>
  <top-bar title="添加收货地址" />

  <van-address-edit
    class="address-form"
    :area-list="areaList"
    :show-delete="isShowDel"
    show-set-default
    :address-info="addressEditInfo"
    show-search-result
    :search-result="searchResult"
    :area-columns-placeholder="['请选择', '请选择', '请选择']"
    @save="onSave"
    @delete="onDelete"
    @change-area="confirmArea"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import TopBar from "@/components/TopBar.vue";
import { addOrUpdateAddress, getCityList } from '../../api/address'
import { Toast } from "vant";
import router from "../../router";
import { areaList } from "@vant/area-data";

// console.log(JSON.stringify(areaList.county_list));

const { addressId, address, areaCode } = defineProps({
  addressId: String,
  address: String,
  areaCode: Number
});

console.log(address);
let cities = []

const searchResult = ref([]);

const isShowDel = computed(() => addressId !== '0')


const addressData = JSON.parse(address)
const addressEditInfo = {
    name: addressData.name,
    tel: addressData.tel,
    province: addressData.address?.split(',')[0],
    city: addressData.address?.split(',')[1],
    county: addressData.address?.split(',')[2],
    addressDetail: addressData.address?.split(',')[3],
    areaCode,
    isDefault: addressData.isDefault
}

const confirmArea = values => {
    console.log(values);
}
const onSave = async result => {

    console.log(result);

    const { data } = await addOrUpdateAddress({
        id: parseInt(addressId),
        phone: result.tel,
        real_name: result.name,
        is_default: result.isDefault,
        detail: result.addressDetail,
        address: {
            province: result.province,
            city: result.city,
            city_id: findCityId(cities, result.city),
            district: result.county,
        }
    })

    if (data.status !== 200) return Toast.fail(data.msg)
    // Toast.success(data.msg)
    Toast.success({
        message: data.msg,
        onClose () {
            router.go(-1)
        }
    })
    // router.go(-1)
    // setTimeout(() => {
    //     router.go(-1)
    // }, 1000);
} 
const onDelete = () => {
    console.log('delelte');
}

const findCityId = (arr, city) => {
    for(let i = 0, l = arr.length; i < l; i++) {
        let province = arr[i].c

        for (let k = 0, len = province.length; k < len; k++) {
            if (province[k].n === city) return province[k].v
        }
    }
}

const initCityData = async () => {

    if (window.localStorage.getItem('addressList')) {
        // return 
        cities = JSON.parse(window.localStorage.getItem('addressList'))
        return
    }

    const { data } = await getCityList()
    if (data.status !== 200) return
    window.localStorage.setItem('addressList', JSON.stringify(data.data))
    // console.log(data);
    cities = data.data
}
initCityData()

</script>

<style lang="scss" scoped>
.address-form {
  margin-top: 40px;
  :deep(.van-button) {
      font-size: 16px;
  }
  :deep(.van-switch--on) {
      background-color: $theme-color;
  }
}
</style>
