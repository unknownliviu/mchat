Messages = new Meteor.Collection('messages');
if (Meteor.isClient) {
//helpers for in-place editing//
  var okcancel_events = function (selector) {
    return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
  };

  var make_okcancel_handler = function(options){
    var ok = options.ok || function() {};
    var cancel = options.cancel || function() {};
    return function (evt){
      if(evt.type === "keydown" && evt.which === 27){
        //esc= cancel
        cancel.call(this, evt);
      } else if(evt.type === "keyup" && evt.which === 13){
        //blur/return/enter = ok if !empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
  };

  Template.entry.events = {};
  Template.entry.events[okcancel_events('#messageBox')] = make_okcancel_handler({
    ok: function (text, event){
      var nameEntry = document.getElementById('name');
      if(nameEntry.value != ""){
        var ts = Date.now() / 1000;
        Messages.insert({ name: nameEntry.value, message: text, time: ts});
        event.target.value = "";
      }
    }
  });

  Template.messages.messages = function(){
    return Messages.find({}, { sort: {time: -1}});
  };
}

