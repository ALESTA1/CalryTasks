//multiple readers / single writer lock
export class Lock {
    readers: number;
    writers: number;
    queue: Array<() => void>;

    constructor() {
        this.readers = 0;
        this.writers = 0;
        this.queue = [];
    }

    async readLock(): Promise<void> {
        return new Promise((resolve) => {
            const reader = () => {
                if (this.writers === 0) {
                    this.readers++;
                    resolve();
                } else {
                    this.queue.push(reader);
                }
            };
            reader();
        });
    }

    async writeLock(): Promise<void> {
        return new Promise((resolve) => {
            const writer = () => {
                if (this.writers === 0 && this.readers === 0) {
                    this.writers++;
                    resolve();
                } else {
                    this.queue.push(writer);
                }
            };
            writer();
        });
    }

    releaseReadLock(): void {
        this.readers--;
        if (this.readers === 0 && this.queue.length > 0) {
            this.queue.shift()(); 
        }
    }

    releaseWriteLock(): void {
        this.writers--;
        if (this.queue.length > 0) {
            this.queue.shift()();
        }
    }
}
