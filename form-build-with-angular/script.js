var app = angular.module("myApp", []);

app.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{a');
    $interpolateProvider.endSymbol('a}');
}]);

app.controller('myController', ["$scope", "$http", function ($scope, $http) {

    $scope.is_checked = false;
    $scope.lead_generation = false;
    $scope.chat_bot_mobile = false;
    $scope.screen_size = $(document).width();
    $scope.form_radio = "required_form"
    $scope.form_required = false;
    $scope.current_page = 'form_page';
    $scope.visitor_data = "";
    $scope.visitor_report_data = [];
    $scope.no_data = false;
    $scope.search_text = "";
    $scope.start_date = "";
    $scope.human_agent_status = "";

    $scope.allField = [];
    $scope.fieldToggleArea = false;
    $scope.isEditField = null;
    $scope.count = 0;

    let radioOption = [];
    let checkboxOption = [];
    let radioFieldOption = null;
    let checkboxFieldOption = null;
    let updField = null;

    let checkboxErrorHandle = false;
    let radioErrorHandle = false;

    window.addEventListener("load", function () {
        document.getElementById('config_form').classList.add("active");
        //        document.getElementById('dashboard').classList.add("active");

        $scope.get_configuration_data();
        $scope.get_visitor_data();
        $scope.get_human_agent_status();
        request_data = {
            "form": {
                "FORM_ELEMENTS": [{
                    "BUTTON": [{
                        "call_back_url": "",
                        "function": "get_form_value('LG_form')",
                        "id": "submitbtn",
                        "title": "Submit",
                        "value": "submit"
                    }]
                },
                {
                    "INPUT": [{
                        "id": "visitor_name",
                        "required": "True",
                        "title": "Enter Your Name*",
                        "type": "text",
                        "validation_error": "Please enter valid name.",
                        "validation_pattern": "^[^ ][a-zA-Z ]{2,30}$",
                        "value": ""
                    },
                    {
                        "id": "visitor_email",
                        "required": "True",
                        "title": "Enter Your Email*",
                        "type": "email",
                        "validation_error": "Please enter valid Email.",
                        "validation_pattern": "^[a-zA-Z0-9]+([.]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.]?[a-zA-Z0-9]+)*([.][a-zA-Z0-9]{1,})+$",
                        "value": ""
                    },
                    {
                        "id": "visitor_phone_number",
                        "required": "True",
                        "title": "Enter Your Phone Number*",
                        "type": "text",
                        "validation_error": "Please enter valid contact number.",
                        "validation_pattern": "^[+]{0,1}[0-9]{9,14}$",
                        "value": ""
                    },
                    {
                        "id": "visitor_message",
                        "required": "True",
                        "title": "Enter Your Message*",
                        "type": "text",
                        "validation_error": "A value cannot exceed 250 characters or be blank.",
                        "validation_pattern": "^([A-Za-z0-9`~!@#$%^&*()_+{}|:<>?/.,';=-])+[A-Za-z0-9`~!@#$%^&*()_+{}|:<>?/ .,';=-]{0,250}$",
                        "value": ""
                    }
                    ]
                }
                ],
                "TITLE_VALUE": "We just need a few details to get you started!",
                "TYPE": "form",
                "form_id": "LG_form"
            },
            "user_ip": localStorage.getItem("user_ip"),
            "auth_token": localStorage.getItem("auth_token"),
        }
        $http({
            method: 'POST',
            url: '/v1/set-configuration-form',
            data: request_data
        }).then(function successCallback(response) {
            let configuration_data = response.data;
        })
        var check_form = document.getElementById("form_allow")
        if (check_form.checked == true) {
            $scope.chat_bot_mobile = true;
        } else {
            $scope.chat_bot_mobile = false;
        }
    });

    $scope.get_config_list = function (ele) {
        if (ele == "form_page") {
            $scope.current_page = ele;
            //            document.getElementById("reportrange").style.display = "none";
        } else if (ele == "visitor_page") {
            $scope.current_page = ele;
            // document.getElementById("reportrange").style.display = "block";
        } else if (ele == "human_agent_setting_page") {
            $scope.current_page = ele;
            //            document.getElementById("reportrange").style.display = "block";
        }
         ;
    }

    $scope.check_form_allowance = function () {
        setTimeout(() => {
            var check_form = document.getElementById("form_allow")
            if (check_form.checked == true) {
                $scope.is_checked = true;
                $scope.lead_generation = true;
                if (document.getElementById("required-form").checked) {
                    $scope.form_required = true;
                } else {
                    $scope.form_required = false;
                }
                var width = $(document).width();
                if (width >= 768) {
                    $scope.chat_bot_mobile = false;
                } else {
                    $scope.chat_bot_mobile = true;
                }
            } else {
                $scope.is_checked = false;
                $scope.lead_generation = false;
                $scope.chat_bot_mobile = false;
            }

            $scope.check_form_value();
             ;
        }, 500);
    };

    $scope.check_form_value = function () {
        $scope.db_lead_generation = "false";
        $scope.db_form_required = "false";
        if ($scope.lead_generation == true) {
            $scope.db_lead_generation = "true";
            if ($scope.form_required == true) {
                $scope.db_form_required = "true"
            } else {
                $scope.db_form_required = "false";
            }
        }
        request_data = {
            "lead_generation_form_status": $scope.db_lead_generation,
            "form_required": $scope.db_form_required,
            "user_ip": localStorage.getItem("user_ip"),
            "auth_token": localStorage.getItem("auth_token")
        }
        if ($scope.db_form_required == "false") {
            request_data['cancel_btn'] = {
                "call_back_url": "",
                "function": "get_form_value('LG_form_cancel')",
                "id": "cancelbtn",
                "title": "Cancel",
                "value": "cancel"
            }
        }

        $http({
            method: 'POST',
            url: '/v1/set-configuration-form',
            data: request_data
        }).then(function successCallback(response) {
            let configuration_data = response.data;

        });
    }

    $scope.open_chat_bot = function (ele) {

        var chat_bot_condition = document.getElementById("chat-bot_wrp").style.display;

        if (chat_bot_condition == '' || chat_bot_condition == 'none') {
            document.getElementById("chat-bot_wrp").style.display = 'block';
            $scope.chat_bot_mobile = true;
            $scope.get_configuration_data();
        } else {
            document.getElementById("chat-bot_wrp").style.display = 'none';
            $scope.chat_bot_mobile = false;
        }
         ;
    };

    $scope.get_configuration_data = function () {
        request_data = {
            "user_ip": localStorage.getItem("user_ip"),
            "auth_token": localStorage.getItem("auth_token")
        };

        $http({
            method: 'POST',
            url: '/v1/get-configuration',
            data: request_data
        }).then(function successCallback(response) {
            let configuration_data = response.data;

            if (configuration_data.status == 200) {
                $scope.flag_data = configuration_data.data;
                try {
                    $scope.db_lead_gen_form_status = response.data.data.lead_generation_form_status.lead_generation_form_status
                    $scope.db_lead_gen_form_buttons_len = response.data.data.lead_generation_form_buttons.lead_generation_form_buttons.length
                    if ($scope.db_lead_gen_form_status == 'true' || $scope.db_lead_gen_form_status == true) {
                        document.getElementById("form_allow").checked = true
                        if ($scope.db_lead_gen_form_buttons_len == 2) {
                            document.getElementById("non-required-form").checked = true
                        } else {
                            document.getElementById("required-form").checked = true
                        }
                        $scope.check_form_allowance();
                    }
                } catch {
                    $scope.db_lead_gen_form_status = " false"
                }
                $scope.set_user_configuration(configuration_data.data);
            }
        }, function (errorResult) {
            // do something on error
            if (errorResult.status === 302) {
                window.location.href = "/v1/login";
            }
        });
    }

    $scope.set_user_configuration = function (config_data) {

        //BOT THEME/MESSAGE CONFIGURATION
        $scope.header_name = config_data.avatar_name;
        $scope.header_color = config_data.theme_configuration.background_normal_color;
        $scope.header_gradient_color = config_data.theme_configuration.background_gradient_color;
        $scope.theme_text_color = config_data.theme_configuration.font_color;
        $scope.welcome_messages = JSON.parse(JSON.stringify(config_data.welcome_messages));

        //  SET USER BUBBLE CONFIGURATION
        $scope.user_bubble_color = config_data.user_response_configuration.bubble_color;
        $scope.user_text_color = config_data.user_response_configuration.font_color;

        //  SET BOT BUBBLE CONFIGURATION
        $scope.bot_bubble_color = config_data.bot_response_configuration.bubble_color;
        $scope.bot_text_color = config_data.bot_response_configuration.font_color;

        //  SET HEADER LOGO CONFIGURATION
        $scope.header_logo = config_data.header_logo;
        $scope.default_logo = config_data.default_logo;
        $scope.header_logo_flag = $scope.header_logo.includes('no_image.png') ? false : true;
        //        $scope.show_header_logo = $scope.header_logo_flag ? "" : "hide"

        //  SET AVATAR LOGO/TEXT CONFIGURATION
        $scope.avatar_logo = config_data.icon_text.logo;
        $scope.avatar_text = config_data.icon_text.text;
        $scope.avatar_logo_flag = config_data.icon_text.logo.includes("no_image") ? false : true;
        $scope.avatar_logo_type = config_data.icon_text.logo.includes("no_image") ? 'text' : 'image';
        $scope.avatar_image_error = config_data.icon_text.logo.includes("no_image") ? true : false;

        //  SET BUTTON CONFIGURATION
        $scope.normal_btn_background_color = config_data.button_configuration.background_color;
        $scope.normal_btn_font_color = config_data.button_configuration.font_color;
        $scope.clicked_btn_background_color = config_data.button_click_response.background_color;
        $scope.clicked_btn_font_color = config_data.button_click_response.font_color;

        if (!config_data['header_logo'].includes('no_image.png')) {
            $scope.profile_logo = config_data['header_logo'];
            $scope.header_logo_flag = true;
        } else {
            try {
                document.getElementById('preview-header-image').style.display = 'none';
                document.getElementById('remove_header_logo_btn').style.opacity = '0';
                $scope.header_logo_flag = false;
                 ;
            } catch { }

            //  ;
        }
        document.getElementById('preview-header-image').src = $scope.header_logo;
    };

    $scope.close_chat_bot = function (ele) {
        var chat_bot = document.getElementsByClassName("chat-bot_wrp");
        chat_bot[0].style.display = 'none';
        $scope.chat_bot_mobile = false;
         ;
        // chat_bot[3].style.height = '0';
    }


    $scope.addElement = function (e) {
        let type = document.getElementById('type-field').value = 'Please Select';
        let label = document.getElementById('label-field').value = '';
        let min = document.getElementById('min-field').value = '';
        let max = document.getElementById('max-field').value = '';
        let required = document.getElementById('required-field').checked = false;

        document.getElementById('formAdd').style.display = 'block';

        let typeField = document.querySelector('#type-field');
        $(typeField).on('change', function (e) {
            e.target.parentElement.classList.add('change');
            if (e.target.value == 'text' || e.target.value == 'number' || e.target.value == 'email' || e.target.value == 'textarea') {
                e.target.parentElement.parentElement.classList.add('text_selector');
            } else {
                e.target.parentElement.parentElement.classList.remove('text_selector');
            }
            if (e.target.value == 'radio') {
                e.target.parentElement.parentElement.classList.add('radio_selector');
            } else {
                e.target.parentElement.parentElement.classList.remove('radio_selector');
            }
            if (e.target.value == 'checkbox') {
                e.target.parentElement.parentElement.classList.add('checkbox_selector');
            } else {
                e.target.parentElement.parentElement.classList.remove('checkbox_selector');
            }
        });

        let pre_defined_radio_btn_list = document.querySelectorAll("[id='radio-option-main']");
        for (let i = 0; i < pre_defined_radio_btn_list.length; i++) {
            pre_defined_radio_btn_list[i].remove();
        }

        let pre_defined_checkbox_btn_list = document.querySelectorAll("[id='checkbox-option-main']");
        for (let i = 0; i < pre_defined_checkbox_btn_list.length; i++) {
            pre_defined_checkbox_btn_list[i].remove();
        }

    } // End addElement Function

    $scope.viewField = function (field) {
        let typeFieldEdit = document.querySelector('#type-field-edit');

        if ($scope.allField[field].type == 'text' || $scope.allField[field].type == 'number' || $scope.allField[field].type == 'email' || $scope.allField[field].type == 'textarea') {
            typeFieldEdit.parentElement.parentElement.classList.add('text_selector');
            typeFieldEdit.parentElement.parentElement.classList.remove('radio_selector');
            typeFieldEdit.parentElement.parentElement.classList.remove('checkbox_selector');
        }
        if ($scope.allField[field].type == 'radio') {
            typeFieldEdit.parentElement.parentElement.classList.add('radio_selector');
            typeFieldEdit.parentElement.parentElement.classList.remove('text_selector');
            typeFieldEdit.parentElement.parentElement.classList.remove('checkbox_selector');
        }
        if ($scope.allField[field].type == 'checkbox') {
            typeFieldEdit.parentElement.parentElement.classList.add('checkbox_selector');
            typeFieldEdit.parentElement.parentElement.classList.remove('text_selector');
            typeFieldEdit.parentElement.parentElement.classList.remove('radio_selector');
        }

        $(typeFieldEdit).on('change', function (e) {
            if (e.target.value == 'text' || e.target.value == 'number' || e.target.value == 'email' || e.target.value == 'textarea') {
                e.target.parentElement.parentElement.classList.add('text_selector');
            } else {
                e.target.parentElement.parentElement.classList.remove('text_selector');
            }
            if (e.target.value == 'radio') {
                e.target.parentElement.parentElement.classList.add('radio_selector');
            } else {
                e.target.parentElement.parentElement.classList.remove('radio_selector');
            }
            if (e.target.value == 'checkbox') {
                e.target.parentElement.parentElement.classList.add('checkbox_selector');
            } else {
                e.target.parentElement.parentElement.classList.remove('checkbox_selector');
            }
        });



        $scope.type = $scope.allField[field].type;
        $scope.label = $scope.allField[field].label;
        $scope.min = Number($scope.allField[field].min);
        if ($scope.min == '') {
            $scope.min = '';
        }
        $scope.max = Number($scope.allField[field].max);
        if ($scope.max == '') {
            $scope.max = '';
        }
        $scope.required = $scope.allField[field].required;

        $scope.radio = $scope.allField[field].radio;
        try {
            let radio_wrp = document.querySelector('.radio_wrpp');
            if ($scope.radio.length > 0){
                for (let i = 0; i < $scope.radio.length; i++) {
                    let html = `<div class="value d-flex ng-scope">
                            <div class="col-5"> <input class="radio radio-field-name-edit redio-required" type="text" value="${$scope.allField[field].radio[i].label}"></div>
                            <div class="col-5"> <input class="radio radio-field-value-edit redio-required" type="text" value="${$scope.allField[field].radio[i].value}"></div>
                            <div class="col-2"> ${$scope.radio.length > 2 ? '<button class="closeRadioButton" onclick="angular.element(this).scope().closeRadio(this)"><i class="fa-solid fa-xmark"></i></button>' : ''}
                            </div>
                        </div>`;
                    radio_wrp.insertAdjacentHTML('beforeend', html);
                }
            }
        } catch (error) {
            console.log(error);
        }

        $scope.checkbox = $scope.allField[field].checkbox;
        try {
            let checkbox_wrp = document.querySelector('.checkbox_wrpp');
            if ($scope.checkbox.length > 0) {
                for (let i = 0; i < $scope.checkbox.length; i++) {
                    let html = `<div class="value d-flex ng-scope">
                            <div class="col-5"> <input class="checkbox checkbox-field-name-edit checkbox-required" type="text" value="${$scope.allField[field].checkbox[i].label}"></div>
                            <div class="col-5"> <input class="checkbox checkbox-field-value-edit checkbox-required" type="text" value="${$scope.allField[field].checkbox[i].value}"></div>
                            <div class="col-2"> ${$scope.checkbox.length > 2 ? '<button class="closeCheckbox" onclick="angular.element(this).scope().closeCheckbox(this)"><i class="fa-solid fa-xmark"></i></button>' : ''}
                            </div>
                        </div>`;
                    checkbox_wrp.insertAdjacentHTML('beforeend', html);
                }
            }
        } catch (error) {
            console.log(error);
        }
        

        $scope.isEditField = $scope.allField[field].id;
        $scope.fieldToggleArea = true;

        document.querySelector('#type-field-edit').value = $scope.type;
        document.querySelector('#label-field-edit').value = $scope.label;
        document.querySelector('#min-field-edit').value = $scope.min;
        document.querySelector('#max-field-edit').value = $scope.max;
        if ($scope.required == true) {
            document.querySelector('#required-field-edit').checked = true;
        } else {
            document.querySelector('#required-field-edit').checked = false;

        }

        document.getElementById('viewField').style.display = 'block';

        let editRadio = document.querySelectorAll('.edit-radio');
        for (var i = 0; i < editRadio.length; i++) {
            editRadio[i].remove();
        }

        let editCheckbox = document.querySelectorAll('.edit-checkbox');
        for (var i = 0; i < editCheckbox.length; i++) { 
            editCheckbox[i].remove(); 
        }

        //  ;

    } // End viewField

    $scope.saveField = function (e) {
        let typeEdit = document.getElementById('type-field-edit').value;
        let labelEdit = document.getElementById('label-field-edit').value;
        let typeReq = document.getElementById('type-field').value;
        let labelReq = document.getElementById('label-field').value;


        checkboxErrorHandle = false;
        radioErrorHandle = false;

        let radioRequired = document.querySelectorAll('.redio-required');
        
        
        let checkboxRequired = document.querySelectorAll('.checkbox-required');

        if (typeReq == '') {
            document.getElementById('type-field').nextElementSibling.style.display = 'block';
            document.getElementById('type-field').addEventListener('change', () => {
                document.getElementById('type-field').nextElementSibling.style.display = 'none';
            });
        }
        if (labelReq == '') {
            document.getElementById('label-field').nextElementSibling.style.display = 'block';
        }
        for (let i = 0; i < radioRequired.length; i++) {
            if (radioRequired[i].value == '') {
                document.querySelector('.error-radio').style.display = 'block';
                document.querySelector('.error-radio-edit').style.display = 'block';
                radioErrorHandle = true;
                break;
            }
        }
        for (let i = 0; i < checkboxRequired.length; i++) {
            if (checkboxRequired[i].value == '') {
                document.querySelector('.error-checkbox').style.display = 'block';
                document.querySelector('.error-checkbox-edit').style.display = 'block';
                checkboxErrorHandle = true;
                break;
            }
        }

        // error for edit
        if (labelEdit == '') {
            document.getElementById('label-field-edit').nextElementSibling.style.display = 'block';
        }



        if ($scope.fieldToggleArea == true && radioErrorHandle == false && checkboxErrorHandle == false && typeEdit !== '' && labelEdit !== '') {
            document.getElementById('type-field').classList.remove('change');
            let type = document.getElementById('type-field-edit').value;
            let label = document.getElementById('label-field-edit').value;
            let min = document.getElementById('min-field-edit').value;
            let max = document.getElementById('max-field-edit').value;
            let required = document.getElementById('required-field-edit').checked;

            // radio start
            if (type == 'radio') {
                radioOption = [];
                let radio_field = document.querySelectorAll('.radio-field-name-edit');
                let radio_value = document.querySelectorAll('.radio-field-value-edit');

                for (var i = 0; i < radio_field.length; i++) {
                    var d = radio_field[i].value;
                    // for (var j = 0; j < radio_value.length; j++) {
                    var e = radio_value[i].value;
                    // }
                    radioFieldOption = {
                        'label': d,
                        'value': e,
                    }
                    radioOption.push(radioFieldOption);
                }
            } // radio end

            // checkbox start
            if (type == 'checkbox') {
                checkboxOption = [];
                let checkbox_field = document.querySelectorAll('.checkbox-field-name-edit');
                let checkbox_value = document.querySelectorAll('.checkbox-field-value-edit');

                for (var i = 0; i < checkbox_field.length; i++) {
                    var m = checkbox_field[i].value;
                    // for (var j = 0; j < checkbox_value.length; j++) {
                    var n = checkbox_value[i].value;
                    // }
                    checkboxFieldOption = {
                        'label': m,
                        'value': n,
                    }

                    checkboxOption.push(checkboxFieldOption);
                }
            } // checkbox end


            updField = $scope.allField.map((e) => {
                if (e.id === $scope.isEditField) {
                    return {
                        'id': e.id,
                        'type': type,
                        'label': label,
                        'min': min,
                        'max': max,
                        'required': required,
                        'radio': radioOption,
                        'checkbox': checkboxOption
                    }
                }
                return e;
            });
            $scope.allField = updField;
            updField = null;
            radioOption = [];
            checkboxOption = [];

            radioFieldOption = null;
            checkboxFieldOption = null;

            $scope.fieldToggleArea = false;
            $scope.isEditField = null;
            console.log($scope.allField);
            
            document.getElementById('viewField').style.display = 'none';

            formAdd.children[0].children[0].children[1].classList.remove('text_selector');
            formAdd.children[0].children[0].children[1].classList.remove('radio_selector');
            formAdd.children[0].children[0].children[1].classList.remove('checkbox_selector');

            document.getElementById('type-field').parentElement.classList.remove('change');
            checkboxErrorHandle = false;
            radioErrorHandle = false;
            try {
                document.querySelector('.radio_wrpp').innerHTML = '';
                document.querySelector('.checkbox_wrpp').innerHTML = '';
                let formError = document.querySelectorAll('.form-error');
                for (let i = 0; i < formError.length; i++) {
                    formError[i].style.display = 'none';
                }
            } catch (error) {
                console.log(error);
            }
            document.getElementById('formAdd').style.display = 'none';

        } else if ($scope.fieldToggleArea == false && radioErrorHandle == false && checkboxErrorHandle == false && typeReq !== '' && labelReq !== '') {
            document.getElementById('type-field').classList.remove('change');
            let formRender = document.getElementById('form_render');
            let formAdd = document.getElementById('formAdd');

            let type = document.getElementById('type-field').value;
            let label = document.getElementById('label-field').value;
            let min = document.getElementById('min-field').value;
            let max = document.getElementById('max-field').value;
            let required = document.getElementById('required-field').checked;

            // radio start
            if (type == 'radio') {
                let radio_field = document.querySelectorAll('.radio-field-name');
                let radio_value = document.querySelectorAll('.radio-field-value');
                let radioField = null;

                for (var i = 0; i < radio_field.length; i++) {
                    var d = radio_field[i].value;
                    // for (var j = 0; j < radio_value.length; j++) {
                        var e = radio_value[i].value;
                    // }

                    radioField = {
                        'label': d,
                        'value': e,
                    }
                    
                    radioOption.push(radioField);
                }
                radioField = null;
            } // radio end

            // checkbox start
            if (type == 'checkbox') {
                let checkbox_field = document.querySelectorAll('.checkbox-field-name');
                let checkbox_value = document.querySelectorAll('.checkbox-field-value');
                let checkboxField = null;

                for (var i = 0; i < checkbox_field.length; i++) {
                    var m = checkbox_field[i].value;
                    // for (var j = 0; j < checkbox_value.length; j++) {
                        var n = checkbox_value[i].value;
                    // }
                    let checkboxField = {
                        'label': m,
                        'value': n,
                    }

                    checkboxOption.push(checkboxField);
                    checkboxField = '';
                }
                checkboxField = null;
            } // checkbox end

            let singleField = {
                'id': new Date().getTime(),
                'type': type,
                'label': label,
                'min': min,
                'max': max,
                'required': required,
                'radio': radioOption,
                'checkbox': checkboxOption
            }

            $scope.allField.push(singleField);
            radioOption = [];
            checkboxOption = [];

            radioFieldOption = '';
            checkboxFieldOption = '';

            let radio_field = document.querySelectorAll('.radio-field-name');
            let radio_value = document.querySelectorAll('.radio-field-value');
            radio_field[0].value = 'radio-1';
            radio_field[1].value = 'radio-2';
            radio_value[0].value = 'radio-1';
            radio_value[1].value = 'radio-2';

            let checkbox_field = document.querySelectorAll('.checkbox-field-name');
            let checkbox_value = document.querySelectorAll('.checkbox-field-value');
            checkbox_field[0].value = 'checkbox-1';
            checkbox_field[1].value = 'checkbox-2';
            checkbox_value[0].value = 'checkbox-1';
            checkbox_value[1].value = 'checkbox-2';

            formAdd.children[0].children[0].children[1].classList.remove('text_selector');
            formAdd.children[0].children[0].children[1].classList.remove('radio_selector');
            formAdd.children[0].children[0].children[1].classList.remove('checkbox_selector');

            document.getElementById('type-field').parentElement.classList.remove('change');
            checkboxErrorHandle = false;
            radioErrorHandle = false;
            try {
                document.querySelector('.radio_wrpp').innerHTML = '';
                document.querySelector('.checkbox_wrpp').innerHTML = '';
                let formError = document.querySelectorAll('.form-error');
                for (let i = 0; i < formError.length; i++) {
                    formError[i].style.display = 'none';
                }
            } catch (error) {
                console.log(error);
            }
            document.getElementById('formAdd').style.display = 'none';

        }
    } // End saveField Function


    $scope.closeRadio = function (e) {
        e.parentElement.parentElement.remove();
        var radio_dis = document.getElementsByClassName("radio_wrp")[0].children;
        if (radio_dis.length <= 2) {
            var disclass = document.getElementsByClassName("closeRadioButton");
            for (let i = 0; i < disclass.length; i++) {
                disclass[i].classList.add("close_none");
            }
        } else {
            var disclass = document.getElementsByClassName("closeRadioButton");
            for (let i = 0; i < disclass.length; i++) {
                disclass[i].classList.remove("close_none");
            }
        }
    }

    $scope.closeCheckbox = function (e) {
        e.parentElement.parentElement.remove();
        var checkbox_dis = document.getElementsByClassName("checkbox_wrp")[0].children;
        if (checkbox_dis.length <= 2) {
            var checkclass = document.getElementsByClassName("closeCheckbox");
            for (let i = 0; i < checkclass.length; i++) {
                checkclass[i].classList.add("close_none");
            }
        } else {
            var checkclass = document.getElementsByClassName("closeCheckbox");
            for (let i = 0; i < checkclass.length; i++) {
                checkclass[i].classList.remove("close_none");
            }
        }
    }

    // for add element
    $scope.radio_append = function (e) {
        let radioField = document.querySelector('.radio-field');
        let radioNode = `<div class="value d-flex" id="radio-option-main">
                            <div class="col-5">
                                <input type="text" placeholder="Name" class="radio radio-field-name redio-required" />
                            </div>
                            <div class="col-5">
                                <input type="text" placeholder="Value" class="radio radio-field-value redio-required" />
                            </div>
                            <div class="col-2">
                                <button onclick="angular.element(this).scope().closeRadio(this)"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                        </div>`;

        radioField.insertAdjacentHTML('beforeend', radioNode);
    }
    // for edit element
    $scope.radio_append_edit = function (e) {
        let radioField = document.querySelector('.radio-field-edit');
        let radioNode = `<div class="value d-flex edit-radio" id="radio-option-main">
                            <div class="col-5">
                                <input type="text" placeholder="Name" class="radio radio-field-name-edit redio-required" />
                            </div>
                            <div class="col-5">
                                <input type="text" placeholder="Value" class="radio radio-field-value-edit redio-required" />
                            </div>
                            <div class="col-2">
                                <button onclick="angular.element(this).scope().closeRadio(this)"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                        </div>`;

        radioField.insertAdjacentHTML('beforeend', radioNode);
    }

    // for add element
    $scope.checkbox_append = function () {
        let checkboxField = document.querySelector('.checkbox-field');
        let checkboxNode = `<div class="value d-flex" id="checkbox-option-main"> 
                                <div class="col-5">
                                    <input type="text" placeholder="Name" class="checkbox checkbox-field-name checkbox-required" />
                                </div>
                                <div class="col-5">
                                    <input type="text" placeholder="Value" class="checkbox checkbox-field-value checkbox-required" />
                                </div>
                                <div class="col-2">
                                    <button onclick="angular.element(this).scope().closeCheckbox(this)"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>`;
        checkboxField.insertAdjacentHTML('beforeend', checkboxNode);
    }
    // for edit element
    $scope.checkbox_append_edit = function () {
        let checkboxField = document.querySelector('.checkbox-field-edit');
        let checkboxNode = `<div class="value d-flex edit-checkbox" id="checkbox-option-main">
                                <div class="col-5">
                                <input type="text" placeholder="Name" class="checkbox checkbox-field-name-edit checkbox-required" />
                                </div>
                                <div class="col-5">
                                <input type="text" placeholder="Value" class="checkbox checkbox-field-value-edit checkbox-required" />
                                </div>
                                <div class="col-2">
                                <button onclick="angular.element(this).scope().closeCheckbox(this)"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>`;
        checkboxField.insertAdjacentHTML('beforeend', checkboxNode);
    }

    $scope.removeField = function (field) {
        $scope.allField.splice(field, 1);
    }

    $scope.close_modal_data_for_form = function (elem) {
        try {
            document.querySelector('.radio_wrpp').innerHTML = '';
            document.querySelector('.checkbox_wrpp').innerHTML = '';
            checkboxErrorHandle = false;
            radioErrorHandle = false;
            let formError = document.querySelectorAll('.form-error');
            for (let i = 0; i < formError.length; i++) {
                formError[i].style.display = 'none';
            }
        } catch (error) {
            console.log(error)
            
        }
        document.getElementById('type-field').parentElement.classList.remove('change');
        document.getElementById('formAdd').style.display = 'none';
        document.getElementById('viewField').style.display = 'none';

        let formAdd = document.getElementById('formAdd');
        formAdd.children[0].children[0].children[1].classList.remove('text_selector');
        formAdd.children[0].children[0].children[1].classList.remove('radio_selector');
        formAdd.children[0].children[0].children[1].classList.remove('checkbox_selector');

        $scope.fieldToggleArea = false;
    } // End close_modal_data_for_form function

    // min max validation
    $scope.minMaxValidation = function() {
        let minField = document.getElementById('min-field');
        let maxField = document.getElementById('max-field');
        maxField.min = minField.value;
        minField.max = maxField.value;
        

        let minFieldEdit = document.getElementById('min-field-edit');
        let maxFieldEdit = document.getElementById('max-field-edit');
        maxFieldEdit.min = minFieldEdit.value;
        minFieldEdit.max = maxFieldEdit.value;
   }

    $scope.enforceMinMax = function(el) {
        setTimeout(() => {
            if (el.value != "") {
                if (parseInt(el.value) < parseInt(el.min)) {
                    el.value = el.min;
                }
                if (parseInt(el.value) > parseInt(el.max)) {
                    el.value = el.max;
                }
            }
        }, 1000);
    }



    $(window).resize(function () {
        var width = $(document).width();
        $scope.screen_size = $(document).width();
        var chat_bot = document.getElementsByClassName("chat-bot_wrp");
        if (width >= 768) {
            chat_bot[0].style.display = 'block';
            $scope.chat_bot_mobile = false;
        } else {
            var chat_bot_mob = chat_bot[0].style.display
            if (chat_bot_mob !== 'block') {
                chat_bot[0].style.display = 'block';
            }
            var check_form = document.getElementById("form_allow")
            if (check_form.checked == true) {
                $scope.chat_bot_mobile = true;
            } else {
                $scope.chat_bot_mobile = false;
            }
        }
    });

    $(function () {

        $scope.start_date = $('#start_date').val();
        $scope.end_date = $('#end_date').val();

        function cb(start, end) {

            if ((typeof start === 'string') && (typeof end === 'string')) { } else if ((typeof start === 'object') && (typeof end === 'string')) {
                $scope.start_date = start.format('YYYY-MM-DD');
            } else if ((typeof start === 'string') && (typeof end === 'object')) {
                $scope.end_date = end.format('YYYY-MM-DD');
            } else {
                $scope.start_date = start.format('YYYY-MM-DD 00:00');
                $scope.end_date = end.format('YYYY-MM-DD 23:59');
            }

            data = {
                "start_date": String($scope.start_date),
                "end_date": String($scope.end_date),
                'is_datetime_changed': true
            }

            if ($scope.start_date && $scope.end_date) {
                $("#main-loader").removeClass("hide-loader");
                $scope.get_visitor_data();
                setTimeout(function () {
                    $("#main-loader").addClass("hide-loader");
                }, 3000);
            }
        }

        $('#reportrange').daterangepicker({

            minDate: moment().subtract(3, 'month'),
            maxDate: moment(moment.now()),
            opens: "left",
            autoUpdateInput: false,
            locale: {
                "direction": "rtl",
                "format": "YYYY-MM-DD",
                "cancelLabel": "Cancel"
            },
            ranges: {
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment(moment.now())],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb($scope.start_date, $scope.end_date);
    });

    $scope.get_visitor_data = function () {
        let data = {
            "user_ip": localStorage.getItem("user_ip"),
            "auth_token": localStorage.getItem("auth_token"),
            "start_date": $scope.start_date,
            "end_date": $scope.end_date
        }
        $("#main-loader").removeClass("hide-loader");
        $http({
            method: 'POST',
            url: '/v1/get-visitor-data',
            data: data
        }).then(function successCallback(response) {
            $scope.visitor_data = response.data;
            $scope.no_data = false;
            $scope.visitor_report_data = [];
            if ($scope.visitor_data.length == 0) {
                $scope.no_data = true;
            }
            for (let i = 0; i < $scope.visitor_data.length; i++) {
                if ($scope.visitor_data[i]['visitor_info'] != null) {
                    $scope.visitor_report_data[i] = JSON.parse($scope.visitor_data[i]['visitor_info'].replace(/'/g, '"'));
                }
            }
            $("#main-loader").addClass("hide-loader");
             ;
        });

    }

    $scope.get_human_agent_status = function () {
        let loader = document.getElementById('loading');
        let request_data = {
            "user_ip": localStorage.getItem("user_ip"),
            "auth_token": localStorage.getItem("auth_token"),
        }
        $http({
            method: 'POST',
            url: '/v1/get-human-agent-status',
            data: request_data
        }).then(function successCallback(response) {

            $("#human_agent_status")[0].checked = response.data.human_agent_status === "true" ? true : false;

            if (response.data.human_agent_status === "true") {
                $scope.human_agent_status = "on";
            } else {
                $scope.human_agent_status = "off";
            }
             ;
        }), function errorCallback(response) {
            loader.style.display = 'none';
            $scope.show_snackbar('Something went wrong please try again later.', '#ff5757');
        }
    }

  

    $scope.search_bar = function () {
        $scope.no_data = false;
        $scope.search_text = document.getElementById("search-bar").value;
        let total_data = document.querySelectorAll('[id ^= "visitor_"]');
        let counter = 0;
        for (let i = 0; i < total_data.length; i++) {
            if (!total_data[i].innerHTML.toLowerCase().includes($scope.search_text.toLowerCase())) {
                total_data[i].style.display = "none";
                counter++;
            }
            else {
                total_data[i].style.display = "";
            }
        }

        if (counter == total_data.length) {
            $scope.no_data = true;
        }
         ;
    }


}]);