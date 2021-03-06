$.fn.extend({
    _opt: {
        placeholader: "请编写发布内容",
        validHtml: [],
        limitSize: 3,
        showServer: !1
    },
    artEditor: function (e) {
        var t = this,
            a = {
                "-webkit-user-select": "text",
                "user-select": "text",
                "overflow-y": "auto",
                "text-break": "brak-all",
                outline: "none",
                cursor: "text"
            };
        $(this).css(a).attr("contenteditable", !0), t._opt = $.extend(t._opt, e);
        try {
            $(t._opt.imgTar).on("change", function (e) {
                var a = e.target.files[0];
                if (e.target.value = "", Math.ceil(a.size / 1024 / 1024) > t._opt.limitSize) return void alert(
                    "文件太大");
                var r = new FileReader;
                r.readAsDataURL(a), r.onload = function (e) {
                    var r = e.target.result,
                        o = new Image;
                    if (o.src = e.target.result, t._opt.compressSize && Math.ceil(a.size / 1024 / 1024) > t._opt.compressSize &&
                        setTimeout(function () {
                            r = t.compressHandler(o)
                        }, 10), t._opt.showServer) return void t.upload(r);
                    var i = '<img src="' + r + '" style="max-width:100%;" />';
                    t.insertImage(i)
                }
            }), t.placeholderHandler(), t.pasteHandler()
        } catch (e) {
            alert(e)
        }
        t._opt.formInputId && $("#" + t._opt.formInputId)[0] && $(t).on("input", function () {
            $("#" + t._opt.formInputId).val(t.getValue())
        }), $(this).on("input click", function () {
            return setTimeout(function () {
                var e = window.getSelection ? window.getSelection() : document.selection;
                t.range = e.createRange ? e.createRange() : e.getRangeAt(0)
            }, 10), !1
        }), !/firefox/.test(navigator.userAgent.toLowerCase()) && this._opt.breaks && $(this).keydown(function (e) {
            if (13 === e.keyCode) return document.execCommand("insertHTML", !1, "<br/><br/>"), !1
        })
    },
    compressHandler: function (e) {
        var t, a = document.createElement("canvas"),
            r = a.getContext("2d"),
            o = document.createElement("canvas"),
            i = o.getContext("2d"),
            n = (e.src.length, e.width),
            l = e.height;
        (t = n * l / 4e6) > 1 ? (t = Math.sqrt(t), n /= t, l /= t) : t = 1, a.width = n, a.height = l, r.fillStyle =
            "#fff", r.fillRect(0, 0, a.width, a.height);
        var s;
        if ((s = n * l / 1e6) > 1) {
            s = ~~ (Math.sqrt(s) + 1);
            var c = ~~ (n / s),
                p = ~~ (l / s);
            o.width = c, o.height = p;
            for (var d = 0; d < s; d++) for (var g = 0; g < s; g++) i.drawImage(e, d * c * t, g * p * t, c * t, p * t,
                0, 0, c, p), r.drawImage(o, d * c, g * p, c, p)
        } else r.drawImage(e, 0, 0, n, l);
        var h = a.toDataURL("image/jpeg", .1);
        return o.width = o.height = a.width = a.height = 0, h
    },
    upload: function (e) {
        var t = this,
            a = t._opt.uploadField || "uploadfile",
            r = $.extend(t._opt.data, {});
        r[a] = e, $.ajax({
            url: t._opt.uploadUrl,
            type: "post",
            data: r,
            cache: !1
        }).then(function (e) {
            var a = t._opt.uploadSuccess(e);
            if (a) {
                var r = '<img src="' + a + '" style="max-width:100%;" />';
                t.insertImage(r)
            } else alert("地址为空!", a)
        }, function (e) {
            t._opt.uploadError(e.status, e)
        })
    },
    insertImage: function (e) {
        $(this).focus();
        var t, a = window.getSelection ? window.getSelection() : document.selection;
        if (this.range ? (t = this.range, this.range = null) : t = a.createRange ? a.createRange() : a.getRangeAt(0),
                window.getSelection) {
            t.collapse(!1);
            for (var r = t.createContextualFragment(e), o = r.lastChild; o && "br" == o.nodeName.toLowerCase() && o.previousSibling &&
            "br" == o.previousSibling.nodeName.toLowerCase();) {
                var i = o;
                o = o.previousSibling, r.removeChild(i)
            }
            t.insertNode(t.createContextualFragment("<br/>")), t.insertNode(r), o && (t.setEndAfter(o), t.setStartAfter(
                o)), a.removeAllRanges(), a.addRange(t)
        } else t.pasteHTML(e), t.collapse(!1), t.select();
        this._opt.formInputId && $("#" + this._opt.formInputId)[0] && $("#" + this._opt.formInputId).val(this.getValue())
    },
    pasteHandler: function () {
        var e = this;
        $(this).on("paste", function (t) {
            console.log(t.clipboardData.items);
            var a = $(this).html();
            console.log(a), valiHTML = e._opt.validHtml, a = a.replace(/_moz_dirty=""/gi, "").replace(/\[/g, "[[-").replace(
                /\]/g, "-]]").replace(/<\/ ?tr[^>]*>/gi, "[br]").replace(/<\/ ?td[^>]*>/gi, "  ").replace(
                /<(ul|dl|ol)[^>]*>/gi, "[br]").replace(/<(li|dd)[^>]*>/gi, "[br]").replace(/<p [^>]*>/gi, "[br]").replace(
                new RegExp("<(/?(?:" + valiHTML.join("|") + ")[^>]*)>", "gi"), "[$1]").replace(new RegExp(
                '<span([^>]*class="?at"?[^>]*)>', "gi"), "[span$1]").replace(/<[^>]*>/g, "").replace(/\[\[\-/g, "[").replace(
                /\-\]\]/g, "]").replace(new RegExp("\\[(/?(?:" + valiHTML.join("|") + "|img|span)[^\\]]*)\\]", "gi"),
                "<$1>"), /firefox/.test(navigator.userAgent.toLowerCase()) || (a = a.replace(/\r?\n/gi, "<br>")), $(
                this).html(a)
        })
    },
    placeholderHandler: function () {
        var e = this,
            t = /<img\s*([\w]+=(\"|\')([^\"\']*)(\"|\')\s*)*\/?>/;
        $(this).on("focus", function () {
            $.trim($(this).text()) === e._opt.placeholader && $(this).html("")
        }).on("blur", function () {
            $.trim($(this).text()) || t.test($(this).html()) || $(this).html(
                '<div class="placeholader" style="pointer-events: none;">' + e._opt.placeholader + "</div>")
        }), $.trim($(this).text()) || t.test($(this).html()) || $(this).html(
            '<div class="placeholader" style="pointer-events: none;">' + e._opt.placeholader + "</div>")
    },
    getValue: function () {
        return $(this).html()
    },
    setValue: function (e) {
        $(this).html(e)
    }
});