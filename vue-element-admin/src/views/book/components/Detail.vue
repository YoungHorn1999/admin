<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <sticky :class-name="'sub-navbar'">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button
        v-loading="loading"
        type="success"
        @click="submitForm"
        style="margin-left: 10px"
      >
        {{ isEdit ? "编辑电子书" : "新增电子书" }}
      </el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <Warning />
        <el-col :span="24">
          <ebook-upload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <MdInput
              v-model="postForm.title"
              :maxlength="100"
              name="name"
              required
            >
              书名
            </MdInput>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="author"
                label="作者："
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.author" placeholder="作者" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="publisher"
                label="出版社："
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.publisher" placeholder="出版社" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="language"
                label="语言："
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.language" placeholder="语言" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="根文件：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.rootFile"
                  placeholder="根文件"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件路径：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.filePath"
                  placeholder="文件路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="解压路径：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="解压路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="封面路径：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件名称：" :label-width="labelWidth">
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="文件名称"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="封面：" :label-width="labelWidth">
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img" />
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="目录：" :label-width="labelWidth">
                <div
                  v-if="postForm.contents && postForm.contents.length > 0"
                  class="contents-wrapper"
                >
                  <el-tree :data="contentsTree" @node-click="onContentClick" />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from "../../../components/Sticky/index";
import Warning from "./Warning";
import EbookUpload from "../../../components/EbookUpload";
import MdInput from "../../../components/MDinput/index";
import { createBook } from "../../../api/book";

const defaultForm = {
  title: "",
  author: "",
  publisher: "",
  language: "",
  rootFile: "",
  cover: "",
  url: "",
  originalName: "",
  filename: "",
  coverPath: "",
  filePath: "",
  unzipPath: "",
};

const fields = {
  title: "书名",
  author: "作者",
  publisher: "出版社",
  language: "语言",
};

export default {
  components: {
    Sticky,
    Warning,
    EbookUpload,
  },
  props: {
    isEdit: Boolean,
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + "必须填写"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      postForm: {},
      fileList: [],
      labelWidth: "120px",
      contentsTree: [],
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
      },
    };
  },
  methods: {
    onContentClick(data) {
      if (data.text) {
        window.open(data.text);
      }
      console.log(data);
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        contentsTree,
        filename,
        coverPath,
        filePath,
        unzipPath,
      } = data;
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        contentsTree,
        filename,
        coverPath,
        filePath,
        unzipPath,
      };
      this.contentsTree = contentsTree;
    },
    showGuide() {
      console.log(666);
    },
    submitForm() {
      if (!this.loading) {
        this.loading = true;
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
            const book = Object.assign({}, this.postForm);
            delete book.contents;
            delete book.contentsTree;
            if (!this.isEdit) {
              createBook(book);
            } else {
              updateBook(book);
            }
          } else {
            const message = fields[Object.keys(fields[0])][0].message;
            this.$message({ message, type: "error" });
            this.loading = false;
          }
        });
      }
    },
    setDefault() {
      this.postForm = Object.assign({}, defaultForm);
      this.contentsTree = [];
    },
    onUploadSuccess(data) {
      this.setData(data);
    },
    onUploadRemove() {
      this.setDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-container {
  padding: 40px 50px 20px;
  .preview-img {
    width: 200px;
    height: 270px;
  }
}
</style>