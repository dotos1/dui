

export const VTypes =
  function () {

    // closure these in so they are only created once.
    const alpha = /^[a-zA-Z_]+$/, alphanum = /^[a-zA-Z0-9_]+$/, email = /^(\w+)([\-+.\'][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/, url = /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;

    // All these messages and functions are configurable
    return {
      /**
               * The function used to validate email addresses.  Note that this is a very basic validation -- complete
               * validation per the email RFC specifications is very complex and beyond the scope of this class, although
               * this function can be overridden if a more comprehensive validation scheme is desired.  See the validation
               * section of the <a href="http://en.wikipedia.org/wiki/E-mail_address">Wikipedia article on email addresses</a>
               * for additional information.  This implementation is intended to validate the following emails:<tt>
               * 'barney@example.de', 'barney.rubble@example.com', 'barney-rubble@example.coop', 'barney+rubble@example.com'
               * </tt>.
               * param value The email address
               * returntrue if the RegExp test passed, and false if not.
               */
      'email': function (v): boolean {
        return email.test(v);
      },
      /**
               * The error text to display when the email validation function returns false.  Defaults to:
               * <tt>'This field should be an e-mail address in the format "user@example.com"'</tt>
               */
      'emailText': 'This field should be an e-mail address in the format "user@example.com"',

      'emailMask': /[a-z0-9_\.\-\+\'@]/i,
      /**
               * The function used to validate URLs
               * param value The URL
               * returntrue if the RegExp test passed, and false if not.
               */
      'url': function (v): boolean {
        return url.test(v);
      },
      /**
               * The error text to display when the url validation function returns false.  Defaults to:
               * <tt>'This field should be a URL in the format "http:/'+'/www.example.com"'</tt>
               */
      'urlText': 'This field should be a URL in the format "http:/' + '/www.example.com"',
      /**
               * The function used to validate alpha values
               * param value The value
               * returntrue if the RegExp test passed, and false if not.
               */
      'alpha': function (v): boolean {
        return alpha.test(v);
      },
      /**
               * The error text to display when the alpha validation function returns false.  Defaults to:
               * <tt>'This field should only contain letters and _'</tt>
               */
      'alphaText': 'This field should only contain letters and _',

      'alphaMask': /[a-z_]/i,
      /**
               * The function used to validate alphanumeric values
               * param value The value
               * returntrue if the RegExp test passed, and false if not.
               */
      'alphanum': function (v): boolean {
        return alphanum.test(v);
      },
      /**
               * The error text to display when the alphanumeric validation function returns false.  Defaults to:
               * <tt>'This field should only contain letters, numbers and _'</tt>
               */
      'alphanumText': 'This field should only contain letters, numbers and _',

      'alphanumMask': /[a-z0-9_]/i
    };
  }();
