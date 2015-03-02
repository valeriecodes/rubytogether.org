jQuery(function($) {
  // Fetch valid CSRF tokens to use later
  $.getJSON("/csrf.json").then(function(json) {
    $("meta[name=csrf-param]").attr("content", json.param);
    $("meta[name=csrf-token]").attr("content", json.token);

    var showFlash = function(message, status) {
      var name = (status === "success") ? "notice" : "alert";
      $(".flashes").html("<p class='flash " + name + "'>" + message + "</p>");
    };

    var sendToken = function(kind) {
      return function(token) {
        var data = {email: token.email, token: token.id, kind: kind};

        $.ajax("/membership", {
          data: data,
          type: (kind === "update" ? "PUT" : "POST")
        }).done(function(res) {
          if (res.url) {
            document.location = res.url;
          } else if (res.message) {
            showFlash(res.message, res.result);
          }
        }).fail(function(xhr, textStatus, errorThrown) {
          showFlash("Something went wrong. :(", "failure");
        });
      };
    };

    $("a[data-subscription]").click(function(e) {
      var kind = $(e.target).data("subscription");
      var amount = $(e.target).data("dollar-amount");

      var options = {
        allowRememberMe: false,
        description: "Membership ($" + amount + " per month)",
        email: $(e.target).data("email"),
        image: "/images/rubies-square.png",
        key: $("meta[name=stripe-token]").attr("content"),
        name: "Ruby Together",
        panelLabel: "Subscribe",
        token: sendToken(kind)
      };

      StripeCheckout.configure(options).open();
      e.preventDefault();
    });

  });
});