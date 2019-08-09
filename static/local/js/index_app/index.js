const GET_URL = "https://jsonplaceholder.typicode.com/todos/1";
// const POST_URL = "https://jsonplaceholder.typicode.com/posts";

ajaxFactory.ajaxHandler(GET_URL, "GET", {}, function(response) {
  console.log(response);
});
// data = {
//   title: "foo",
//   body: "bar",
//   userId: 1
// };
// ajaxFactory.ajaxHandler(POST_URL, "POST", data, function(response) {
//   console.log(response);
// });
// console.log(ajaxFactory.getCookie("csrftoken"));
