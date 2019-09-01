var base_url = window.location.protocol + "//" + window.location.hostname;
var ajaxFactory = {
  ajaxHandler: function (url, method, data, callback) {
    if (data != undefined) {
      if (method.toLowerCase() != "get") {
        data = JSON.stringify(data);
      }
    }
    var csrf_token = ajaxFactory.getCookie("csrftoken");

    $.ajax({
      url: url,
      type: method,
      data: data,
      contentType: "application/json",
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        //xhr.setRequestHeader("Authorization", "JWT " + token);
      },
      success: function (response, status, xhr) {
        callback(response);
      },
      error: function (response, status, error) {
        if (typeof callback != "undefined" && response) {
          callback(response.responseJSON);
        }
        //else if (response.status == 401) {
        //    ajaxFactory.secureHTTPRequestHandler(url, method, data, callback, 'expired')
        //}
      }
    });
  },
  ajaxHandlerFile: function (url, method, data, callback, progress_bar_card) {
    var csrf_token = ajaxFactory.getCookie("csrftoken");
    var ajax_data = {
      url: url,
      type: method,
      data: data,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
      },
      xhr: function () {
        var xhr = $.ajaxSettings.xhr();

        if (xhr.upload) {
          xhr.upload.addEventListener(
            "progress",
            function (evt) {
              if (evt.lengthComputable) {
                var percent = ((evt.loaded * 0.75) / evt.total) * 100;
                progress_bar_card.find(".progress-bar").width(percent + "%");
                progress_bar_card
                  .find(".uploaded_file_size")
                  .text(
                    parseFloat(
                      (progress_bar_card.find(".total_file_size").text() *
                        evt.loaded) /
                      evt.total
                    ).toFixed(1)
                  );
                if (evt.loaded == evt.total) {
                  progress_bar_card.find(".loading_msg").html("Processing");
                  ajaxFactory.fake_progress(progress_bar_card);
                }
              }
            },
            false
          );
          xhr.upload.addEventListener("load", function (evt) { });
        }
        return xhr;
      },
      success: function (response) {
        if (typeof callback != "undefined" && response) {
          callback(response);
        }
      },
      error: function (response) {
        if (typeof callback != "undefined" && response) {
          callback(response.responseJSON);
        }
      }
    };
    $.ajax(ajax_data);
  },
  ajaxHandlerFileJWT: function (url, method, data, callback, progress_bar_card) {
    var token = localStorage.getItem("jwt_token");
    var csrf_token = ajaxFactory.getCookie("csrftoken");
    var ajax_data = {
      url: url,
      type: method,
      data: data,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.setRequestHeader("Authorization", "JWT " + token);
      },
      xhr: function () {
        var xhr = $.ajaxSettings.xhr();

        if (xhr.upload) {
          xhr.upload.addEventListener(
            "progress",
            function (evt) {
              if (evt.lengthComputable) {
                var percent = ((evt.loaded * 0.75) / evt.total) * 100;
                progress_bar_card.find(".progress-bar").width(percent + "%");
                progress_bar_card
                  .find(".uploaded_file_size")
                  .text(
                    parseFloat(
                      (progress_bar_card.find(".total_file_size").text() *
                        evt.loaded) /
                      evt.total
                    ).toFixed(1)
                  );
                if (evt.loaded == evt.total) {
                  progress_bar_card.find(".loading_msg").html("Processing");
                  ajaxFactory.fake_progress(progress_bar_card);
                }
              }
            },
            false
          );
          xhr.upload.addEventListener("load", function (evt) { });
        }
        return xhr;
      },
      success: function (response) {
        if (typeof callback != "undefined" && response) {
          callback(response);
        }
      },
      error: function (response) {
        if (typeof callback != "undefined" && response) {
          callback(response.responseJSON);
        }
      }
    };
    $.ajax(ajax_data);
  },
  ajaxHandlerJWTImage: function (url, method, data, callback) {
    var token = localStorage.getItem("jwt_token");
    var csrf_token = ajaxFactory.getCookie("csrftoken");

    $.ajax({
      url: url,
      type: method,
      data: data,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.setRequestHeader("Authorization", "JWT " + token);
      },
      success: function (response) {
        if (typeof callback != "undefined" && response) {
          callback(response);
        }
      },
      error: function (response, status, error) {
        if (typeof callback != "undefined" && response) {
          callback(response.responseJSON);
        } else if (response.status == 401) {
          ajaxFactory.secureHTTPRequestHandlerImage(
            url,
            method,
            data,
            callback,
            "expired"
          );
        }
      }
    });
  },

  ajaxHandlerJWT: function (url, method, data, callback) {
    var token = localStorage.getItem("jwt_token");
    if (method.toLowerCase() != "get") {
      data = JSON.stringify(data);
    }
    var csrf_token = ajaxFactory.getCookie("csrftoken");
    $.ajax({
      url: url,
      type: method,
      data: data,
      contentType: "application/json",
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.setRequestHeader("Authorization", "JWT " + token);
      },
      success: function (response, status, xhr) {
        callback(response);
      },
      error: function (response, status, error) {
        if (typeof callback != "undefined" && response) {
          callback(response.responseJSON);
        } else if (response.status == 401) {
          ajaxFactory.secureHTTPRequestHandler(
            url,
            method,
            data,
            callback,
            "expired"
          );
        }
      }
    });
  },

  getCookie: function (name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  },
  secureHTTPRequestHandler: function (url, method, data, callback, type) {
    var token = localStorage.getItem("jwt_token");

    if (token == "" || type == "expired") {
      ajaxFactory.ajaxHandler(base_url + "/api/token/", "GET", {}, function (
        response
      ) {
        localStorage.setItem("jwt_token", response.token);
        ajaxFactory.ajaxHandlerJWT(url, method, data, callback);
      });
    } else {
      ajaxFactory.ajaxHandlerJWT(url, method, data, callback);
    }
  },

  secureHTTPRequestHandlerImage: function (url, method, data, callback, type) {
    var token = localStorage.getItem("jwt_token");
    if (token == "" || type == "expired") {
      ajaxFactory.ajaxHandler(base_url + "/api/token/", "GET", {}, function (
        response
      ) {
        localStorage.setItem("jwt_token", response.token);
        ajaxFactory.ajaxHandlerJWTImage(url, method, data, callback);
      });
    } else {
      ajaxFactory.ajaxHandlerJWTImage(url, method, data, callback);
    }
  }
};
