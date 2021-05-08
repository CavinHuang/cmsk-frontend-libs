import Vue from 'vue'

export declare class BaseComponent extends Vue {
  static name: string;
  static install(vue: typeof Vue): void;
}
