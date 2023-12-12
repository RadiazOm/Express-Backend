import {el} from "@faker-js/faker";

export default class Pagination {
    static format(items, query) {
        let start = 1;
        let limit = NaN;
        let total = items.length
        if (query.start !== undefined) {
            start = query.start
            if (start > total) {
                start = total
            }
        }
        if (query.limit !== undefined) {
            limit = query.limit
        }
        console.log(start, limit, total)

        return {
            currentPage: this.currentPage(total, start, limit),
            currentItems: this.currentItems(total, start, limit),
            totalPages: this.numberOfPages(total, start, limit),
            totalItems: items.length,
            _links: {
                first: {
                    page: this.itemToPageNumber(total, start, limit, this.firstPageItem(total, start, limit)),
                    href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/${this.getFirstQueryString(total, start, limit)}`
                },
                last: {
                    page: this.itemToPageNumber(total, start, limit, this.lastPageItem(total, start, limit)),
                    href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/${this.getLastQueryString(total, start, limit)}`
                },
                previous: {
                    page: this.itemToPageNumber(total, start, limit, this.previousPageItem(total, start, limit)),
                    href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/${this.getPreviousQueryString(total, start, limit)}`
                },
                next: {
                    page: this.itemToPageNumber(total, start, limit, this.nextPageItem(total, start, limit)),
                    href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/${this.getNextQueryString(total, start, limit)}`
                }
            }
        };
    }
    static currentItems(total, start, limit) {
        if (isNaN(limit)) {
            return total - (start - 1)
        } else {
            return Math.min(limit, total - (start - 1))
        }
    }

    static numberOfPages(total, start, limit) {
        if (isNaN(limit)) {
            return 1
        } else {
            return Math.ceil(total / limit)

        }
    }

    static currentPage(total, start, limit) {
        if (isNaN(limit)) {
            return 1
        } else {
            return Math.ceil(start / limit)
        }
    }

    static firstPageItem(total, start, limit) {
        return 1
    }

    static lastPageItem(total, start, limit) {
        if (isNaN(limit)) {
            return 1
        } else {
            return (this.numberOfPages(total, start, limit) * limit - limit) + 1
        }
    }

    static previousPageItem(total, start, limit) {
        if (isNaN(limit)) {
            return 1
        }
        if (this.currentPage(total, start, limit) <= 1) {
            return this.firstPageItem(total, start, limit)
        } else {
            return ((this.currentPage(total, start, limit) - 1) * limit) - (limit - 1)
        }
    }

    static nextPageItem(total, start, limit) {
        if (isNaN(limit)) {
            return 1
        }
        if (this.currentPage(total, start, limit) >= this.numberOfPages(total, start, limit)) {
            return this.lastPageItem(total, start, limit)
        } else {
            return ((this.currentPage(total, start, limit) + 1) * limit) - (limit - 1)
        }
    }

    static getFirstQueryString(total, start, limit) {
        if (isNaN(limit)) {
            return `?start=${this.firstPageItem(total, start, limit)}`
        } else {
            return `?start=${this.firstPageItem(total, start, limit)}&limit=${limit}`
        }
    }

    static getLastQueryString(total, start, limit) {
        if (isNaN(limit)) {
            return `?start=${this.lastPageItem(total, start, limit)}`
        } else {
            return `?start=${this.lastPageItem(total, start, limit)}&limit=${limit}`
        }
    }

    static getPreviousQueryString(total, start, limit) {
        if (isNaN(limit)) {
            return `?start=${this.previousPageItem(total, start, limit)}`
        } else {
            return `?start=${this.previousPageItem(total, start, limit)}&limit=${limit}`
        }
    }

    static getNextQueryString(total, start, limit) {
        if (isNaN(limit)) {
            return `?start=${this.nextPageItem(total, start, limit)}`
        } else {
            return `?start=${this.nextPageItem(total, start, limit)}&limit=${limit}`
        }
    }

    static itemToPageNumber(total, start, limit, itemNumber) {
        return this.currentPage(total, itemNumber, limit)
    }


}