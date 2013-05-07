// Generated by CoffeeScript 1.3.3
(function() {
  var form_disabled, is_redrawing, load_bitstamp, load_mtgox, rates, redraw_result, refresh_rate, source_name, timeouts_count, triggered_load_bitstamp, triggered_load_mtgox, update_form_class,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  rates = {
    mtgox: false,
    bitstamp: false
  };

  timeouts_count = 0;

  refresh_rate = 1000;

  triggered_load_mtgox = false;

  load_mtgox = function(after_load) {
    if (after_load == null) {
      after_load = false;
    }
    if ($('#currency_chooser').is(':visible') && !triggered_load_mtgox) {
      triggered_load_mtgox = true;
      return $.ajax($('#currency_chooser').val(), {
        success: function(data, textStatus) {
          var data_rate;
          data_rate = parseFloat(data['rate']);
          if (!isNaN(data_rate)) {
            rates['mtgox'] = data_rate;
          }
          if (typeof after_load === 'function') {
            return after_load();
          }
        },
        complete: function() {
          setTimeout(load_mtgox, refresh_rate);
          redraw_result();
          return triggered_load_mtgox = false;
        }
      });
    }
  };

  triggered_load_bitstamp = false;

  load_bitstamp = function(after_load) {
    if (after_load == null) {
      after_load = false;
    }
    if (!triggered_load_bitstamp) {
      triggered_load_bitstamp = true;
      return $.ajax('/bitstamp.json', {
        success: function(data, textStatus, jqXhr) {
          var high, low;
          high = parseFloat(data['high']);
          low = parseFloat(data['low']);
          if (!isNaN(high || isNaN(low))) {
            rates['bitstamp'] = (high + low) / 2;
          }
          if (typeof after_load === 'function') {
            return after_load();
          }
        },
        complete: function() {
          setTimeout(load_bitstamp, refresh_rate);
          redraw_result();
          return triggered_load_bitstamp = false;
        }
      });
    }
  };

  is_redrawing = false;

  redraw_result = function() {
    var amount, rate;
    if (!is_redrawing) {
      is_redrawing = true;
      amount = parseFloat($('#btc_count').val());
      rate = rates[source_name()];
      if (!(!amount || !rate)) {
        $('#result').val(Math.round(amount * rate * 100) / 100);
      }
      return is_redrawing = false;
    }
  };

  source_name = function() {
    return $('footer input.source_chooser:checked').val();
  };

  form_disabled = function(how) {
    return $('#main_form').find('input, select').prop('disabled', !!how);
  };

  update_form_class = function(cls) {
    return $('#main_form').removeClass('bitstamp_chosen mtgox_chosen').addClass(cls + '_chosen');
  };

  $(function() {
    var to_handler;
    form_disabled(true);
    load_mtgox(function() {
      return form_disabled(false);
    });
    $('#btc_count').on('keypress', function(evt) {
      var code;
      code = evt.which;
      if (!((__indexOf.call([48, 49, 50, 51, 52, 53, 54, 55, 56, 57], code) >= 0) || code === 46)) {
        return evt.preventDefault();
      } else {
        return redraw_result;
      }
    });
    $('input.source_chooser').on('change', function(evt) {
      var val;
      val = $(this).val();
      redraw_result();
      update_form_class(val);
      if (val === 'mtgox') {
        return setTimeout(load_mtgox, refresh_rate);
      }
    });
    to_handler = function() {
      load_bitstamp();
      return load_mtgox();
    };
    return setTimeout(to_handler, refresh_rate);
  });

}).call(this);
