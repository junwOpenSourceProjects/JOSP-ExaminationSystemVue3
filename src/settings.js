/*
 * @Author: junw wo1261931780@gmail.com
 * @Date: 2023-11-09 18:13:23
 * @LastEditors: junw wo1261931780@gmail.com
 * @LastEditTime: 2024-02-04 13:05:50
 * @FilePath: \JOSP-ExaminationSystemVue\src\settings.js
 * @Description: 1111
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = {
  title: 'Vue Element Admin',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {boolean} true | false
   * @description Whether support pinyin search in headerSearch
   * Bundle size minified 47.3kb,minified + gzipped 63kb
   */
  supportPinyinSearch: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
