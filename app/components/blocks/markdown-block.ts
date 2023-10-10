import Component from '@glimmer/component';
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import { MarkdownBlock } from 'codecrafters-frontend/lib/blocks';
import { action } from '@ember/object';

import Prism from 'prismjs';

import 'prismjs';
import 'prismjs/components/prism-rust'; // This is the only one we use in concepts at the moment

type Signature = {
  Element: HTMLDivElement;

  Args: {
    model: MarkdownBlock;
  };
};

export default class MarkdownBlockComponent extends Component<Signature> {
  get html() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.args.model.markdown));
  }

  @action
  handleDidInsertHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Blocks::MarkdownBlock': typeof MarkdownBlockComponent;
  }
}
