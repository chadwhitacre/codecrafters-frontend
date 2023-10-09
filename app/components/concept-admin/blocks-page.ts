import Component from '@glimmer/component';
import ConceptModel, { Block } from 'codecrafters-frontend/models/concept';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    concept: ConceptModel;
  };
};

type BlockWithMetadata = {
  id: string;
  block: Block;
  wasAdded: boolean;
  wasChanged: boolean;
  wasDeleted: boolean;
  anchorBlockIndex: number; // -1 if block was added at start
  addedBlockIndex: number; // Only used for added blocks, relative to anchorBlockIndex. Not using null as a type since we wouldn't get glint checking
};

export default class BlocksPageComponent extends Component<Signature> {
  @tracked blockChanges: Record<number, { oldBlock: Block; newBlock: Block }> = {};
  @tracked blockAdditions: Record<number, { anchorBlock: Block | null; newBlocks: Block[] }> = {};
  @tracked blockDeletions: Record<number, { oldBlock: Block }> = {};
  @tracked isSaving = false;

  get blocksWithMetadata(): BlockWithMetadata[] {
    const result: BlockWithMetadata[] = [];

    (this.blockAdditions[-1]?.newBlocks || []).map((block, index) => {
      result.push({
        id: `added-at-start-${index}`,
        block: block,
        wasAdded: true,
        wasChanged: false,
        wasDeleted: false,
        anchorBlockIndex: -1, // -1 if block was added at start
        addedBlockIndex: index,
      });
    });

    this.args.concept.parsedBlocks.forEach((block, index) => {
      const wasChanged = !!this.blockChanges[index];
      const wasDeleted = !!this.blockDeletions[index];
      const addedBlocks = this.blockAdditions[index]?.newBlocks || [];

      result.push({
        id: `block-${index}`,
        block: this.blockChanges[index]?.newBlock || block,
        wasAdded: false,
        wasChanged: wasChanged,
        wasDeleted: wasDeleted,
        anchorBlockIndex: index,
        addedBlockIndex: -1, // Isn't an added block
      });

      addedBlocks.forEach((addedBlock, addedBlockIndex) => {
        result.push({
          id: `block-${index}-added-${addedBlockIndex}`,
          block: addedBlock,
          wasAdded: true,
          wasChanged: false,
          wasDeleted: false,
          anchorBlockIndex: index,
          addedBlockIndex: addedBlockIndex,
        });
      });
    });

    return result;
  }

  get mutationsArePresent() {
    return this.numberOfBlockAdditions > 0 || this.numberOfBlockChanges > 0 || this.numberOfBlockDeletions > 0;
  }

  get numberOfBlockAdditions(): number {
    return Object.entries(this.blockAdditions).reduce<number>((sum, [_, addition]) => sum + addition.newBlocks.length, 0);
  }

  get numberOfBlockChanges() {
    return Object.keys(this.blockChanges).length;
  }

  get numberOfBlockDeletions() {
    return Object.keys(this.blockDeletions).length;
  }

  get rawBlocksAfterMutations() {
    const blocks: Block[] = [];

    if (this.blockAdditions[-1]) {
      blocks.push(...this.blockAdditions[-1]!.newBlocks);
    }

    this.args.concept.parsedBlocks.forEach((block, index) => {
      if (this.blockDeletions[index]) {
        // Skip
      } else if (this.blockChanges[index]) {
        blocks.push(this.blockChanges[index]!.newBlock);
      } else {
        blocks.push(block);
      }

      if (this.blockAdditions[index]) {
        blocks.push(...this.blockAdditions[index]!.newBlocks);
      }
    });

    return blocks.map((block) => block.toJSON);
  }

  @action
  handleAddedBlockChanged(anchorBlockIndex: number, addedBlockIndex: number, newBlock: Block) {
    this.blockAdditions[anchorBlockIndex]!.newBlocks[addedBlockIndex] = newBlock;
    this.blockAdditions = { ...this.blockAdditions }; // Force re-render
  }

  @action
  handleAddedBlockDeleted(anchorBlockIndex: number, addedBlockIndex: number) {
    this.blockAdditions[anchorBlockIndex]!.newBlocks.splice(addedBlockIndex, 1);
    this.blockAdditions = { ...this.blockAdditions }; // Force re-render
  }

  @action
  handleBlockAdded(anchorBlockIndex: number, insertAtIndex: number, newBlock: Block) {
    if (this.blockAdditions[anchorBlockIndex]) {
      this.blockAdditions[anchorBlockIndex]!.newBlocks.splice(insertAtIndex, 0, newBlock);
    } else {
      if (insertAtIndex !== 0) {
        throw new Error('Expected insertAtIndex to be 0 when adding a new blockAddition');
      }

      // anchorBlock is null if the block is being added at the start of the list
      this.blockAdditions[anchorBlockIndex] = { anchorBlock: this.args.concept.parsedBlocks[anchorBlockIndex] || null, newBlocks: [newBlock] };
    }

    this.blockAdditions = { ...this.blockAdditions }; // Force re-render
  }

  @action
  handleBlockChangeDiscarded(index: number) {
    delete this.blockChanges[index];

    this.blockChanges = { ...this.blockChanges }; // Force re-render
  }

  @action
  handleBlockChanged(index: number, newBlock: Block) {
    const oldBlock = this.args.concept.parsedBlocks[index]!;

    if (newBlock.isEqual(oldBlock)) {
      delete this.blockChanges[index];
    } else {
      this.blockChanges[index] = {
        oldBlock: this.args.concept.parsedBlocks[index]!,
        newBlock: newBlock,
      };
    }

    this.blockChanges = { ...this.blockChanges }; // Force re-render
  }

  @action
  handleBlockDeleted(index: number) {
    this.blockDeletions[index] = {
      oldBlock: this.args.concept.parsedBlocks[index]!,
    };

    if (this.blockChanges[index]) {
      delete this.blockChanges[index];
    }

    this.blockChanges = { ...this.blockChanges }; // Force re-render
    this.blockDeletions = { ...this.blockDeletions }; // Force re-render
  }

  @action
  handleBlockDeletionDiscarded(index: number) {
    delete this.blockDeletions[index];

    this.blockDeletions = { ...this.blockDeletions }; // Force re-render
  }

  @action
  async handlePublishButtonClicked() {
    this.isSaving = true;

    await this.args.concept.updateBlocks({
      'old-blocks': this.args.concept.blocks,
      'new-blocks': this.rawBlocksAfterMutations,
    });

    this.blockChanges = {};
    this.blockAdditions = {};
    this.blockDeletions = {};

    this.isSaving = false;
  }

  @action
  handleSortableItemsReordered(sortedItems: (BlockWithMetadata | string)[], movedBlockWithMetadata: BlockWithMetadata) {
    const sortedBlocksWithMetadata = sortedItems.filter((item) => typeof item !== 'string') as BlockWithMetadata[];
    const movedBlockIndex = sortedBlocksWithMetadata.findIndex((blockWithMetadata) => blockWithMetadata.id === movedBlockWithMetadata.id);
    const previousBlockWithMetadata = sortedBlocksWithMetadata[movedBlockIndex - 1];

    if (previousBlockWithMetadata) {
      if (previousBlockWithMetadata.wasAdded) {
        this.handleBlockAdded(
          previousBlockWithMetadata.anchorBlockIndex,
          previousBlockWithMetadata.addedBlockIndex + 1,
          movedBlockWithMetadata.block,
        );
      } else {
        this.handleBlockAdded(previousBlockWithMetadata.anchorBlockIndex, 0, movedBlockWithMetadata.block);
      }
    } else {
      this.handleBlockAdded(-1, 0, movedBlockWithMetadata.block);
    }

    if (movedBlockWithMetadata.wasAdded) {
      this.handleAddedBlockDeleted(movedBlockWithMetadata.anchorBlockIndex, movedBlockWithMetadata.addedBlockIndex);
    } else {
      this.handleBlockDeleted(movedBlockWithMetadata.anchorBlockIndex);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::BlocksPage': typeof BlocksPageComponent;
  }
}
