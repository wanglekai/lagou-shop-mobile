import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import './styles/base.css'

// import Vant from 'vant'
import {
    Button,
    Cell,
    CellGroup,
    Form,
    AddressEdit,
    Checkbox,
    Stepper,
    SubmitBar,
    Empty,
    NavBar,
    Icon,
    PullRefresh,
    Swipe,
    Grid,
    GridItem,
    NoticeBar,
    List,
    Field,
    Popup,
    AddressList,
    ActionBar,
    ActionSheet,
    Radio,
    RadioGroup,
    Tab,
    Tabs,
    Tabbar,
    TabbarItem,
    ActionBarIcon,
    ActionBarButton
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)
app.use(store)
// app.use(Vant)
app.use(Button)
    .use(Cell)
    .use(CellGroup)
    .use(Form)
    .use(AddressEdit)
    .use(Checkbox)
    .use(Stepper)
    .use(SubmitBar)
    .use(Empty)
    .use(NavBar)
    .use(Icon)
    .use(PullRefresh)
    .use(Swipe)
    .use(Grid)
    .use(GridItem)
    .use(NoticeBar)
    .use(List)
    .use(Field)
    .use(Popup)
    .use(AddressList)
    .use(ActionBar)
    .use(ActionSheet)
    .use(Radio)
    .use(RadioGroup)
    .use(Tab)
    .use(Tabs)
    .use(Tabbar)
    .use(TabbarItem)
    .use(ActionBarIcon)
    .use(ActionBarButton)
    // Tabbar

    
app.mount('#app')
