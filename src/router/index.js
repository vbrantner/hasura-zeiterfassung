import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  // {
  //   path: "/signup",
  //   name: "Signup",
  //   component: () => import("../views/Signup.vue"),
  // },
  {
    path: "/mitarbeiterverwaltung",
    name: "Mitarbeiterverwaltung",
    component: () => import("../views/EmployeeManagement.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/stempeluhr",
    name: "Stempeluhr",
    component: () => import("../views/TimeClock.vue"),
    meta: {
      requiresAuth: true,
    }
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !store.getters.isUserAuth) {
    next("login");
  } else {
    next();
  }
});

export default router;
