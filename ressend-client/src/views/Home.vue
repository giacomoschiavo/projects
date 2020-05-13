<template>
  <div>
    <button @click="showMessageForm = !showMessageForm" type="button" class="btn btn-info mt-3">
      Toggle message form
    </button>
    <form v-if="showMessageForm" @submit.prevent="addMessage" class="mt-3">
      <div v-if="error" class="alert alert-dismissible alert-danger m-2">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <h4 class="alert-heading">Warning!</h4>
        <p class="mb-0">{{ error }}</p>
      </div>
      <fieldset>
        <legend>Send your message!</legend>
        <div class="form-group">
          <label for="username">Your username</label>
          <input v-model="message.username" type="text" class="form-control" id="username" />
        </div>
        <div class="form-group">
          <label for="subject">Your subject</label>
          <input
            v-model="message.subject"
            type="text"
            class="form-control"
            id="subject"
            placeholder="pandas"
            required
          />
        </div>
        <div class="form-group">
          <label for="messageForm">Your message</label>
          <textarea
            v-model="message.message"
            class="form-control"
            id="messageForm"
            rows="3"
            placeholder="I want to say something to the world but I have no words."
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="imageURL">Enter your image URL</label>
          <input
            v-model="message.imageURL"
            type="url"
            class="form-control"
            id="imageURL"
            placeholder="https://i.giphy.com/media/lgcUUCXgC8mEo/giphy.webp"
          />
        </div>
      </fieldset>
      <button type="submit" class="btn btn-outline-primary">Send message!</button>
    </form>
    <div class="list-unstyled mt-3" v-for="message in reversedMessage" :key="message._id">
      <li class="media">
        <img v-if="message.imageURL" :src="message.imageURL" class="mr-3" :alt="message.subject" />
        <div class="media-body">
          <h4 class="mt-0 mb-1">{{ message.username }}</h4>
          <h5 class="mt-0 mb-1">{{ message.subject }}</h5>
          {{ message.message }}
          <br />
          <small>{{ message.created }}</small>
        </div>
      </li>
      <hr />
    </div>
  </div>
</template>

<script>
/* eslint-disable */

const API_URL = "https://ressend.herokuapp.com/messages";
export default {
  name: "Home",
  data: () => ({
    error: "",
    showMessageForm: false,
    messages: [],
    message: {
      username: "xXxanonyMusXxX",
      subject: "",
      message: "",
      imageURL: ""
    }
  }),
  mounted() {
    fetch(API_URL).then(async response => {
      const json = await response.json();
      this.messages = json;
    });
  },
  computed: {
    reversedMessage() {
      return this.messages.slice().reverse();
    }
  },
  methods: {
    addMessage() {
      console.log(this.message);
      fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(this.message),
        headers: {
          "content-type": "application/json"
        }
      }).then(async res => {
        const result = await res.json();
        if (result.details) {
          const errorMessage = result.details.map(detail => detail.message).join(".\n");
          this.error = errorMessage;
        } else {
          this.error = "";
          this.showMessageForm = false;
          this.messages.push(result);
        }
      });
    }
  }
};
</script>

<style>
hr {
  border-top: 1px solid white;
}

img {
  max-width: 300px;
  height: auto;
}
</style>
