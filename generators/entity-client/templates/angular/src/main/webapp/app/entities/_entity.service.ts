<%#
 Copyright 2013-2018 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see http://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
<%_
    let hasDate = false;
    if (fieldsContainInstant || fieldsContainZonedDateTime || fieldsContainLocalDate) {
        hasDate = true;
    }
_%>
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
<%_ if (hasDate) { _%>
import * as moment from 'moment';
<%_ } _%>

import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from '../../shared';
import { <%= entityAngularName %> } from './<%= entityFileName %>.model';

type EntityResponseType = HttpResponse<<%= entityAngularName %>>;
type EntityArrayResponseType = HttpResponse<<%= entityAngularName %>[]>;

@Injectable()
export class <%= entityAngularName %>Service {

    private resourceUrl =  SERVER_API_URL + '<% if (applicationType === 'gateway' && locals.microserviceName) { %><%= microserviceName.toLowerCase() %>/<% } %>api/<%= entityApiUrl %>';
    <%_ if (searchEngine === 'elasticsearch') { _%>
    private resourceSearchUrl = SERVER_API_URL + '<% if (applicationType === 'gateway' && locals.microserviceName) { %><%= microserviceName.toLowerCase() %>/<% } %>api/_search/<%= entityApiUrl %>';
    <%_ } _%>

    constructor(private http: HttpClient) { }

    <%_ if (entityAngularName.length <= 30) { _%>
    create(<%= entityInstance %>: <%= entityAngularName %>): Observable<EntityResponseType> {
    <%_ } else { _%>
    create(<%= entityInstance %>: <%= entityAngularName %>):
        Observable<EntityResponseType> {
    <%_ } _%>
        <%_ if (hasDate) { _%>
        const copy = this.convertDateFromClient(<%= entityInstance %>);
        <%_ } _%>
            return this.http.post<<%= entityAngularName %>>(this.resourceUrl,
                    <%_ if (hasDate) { _%> copy <%_ } else { _%> <%= entityInstance %> <%_ } _%>,
                    { observe: 'response' })
            <%_ if (hasDate) { _%>.map((res: EntityResponseType) => this.convertDateFromServer(res))<%_ } _%>;
    }

    <%_ if (entityAngularName.length <= 30) { _%>
    update(<%= entityInstance %>: <%= entityAngularName %>): Observable<EntityResponseType> {
    <%_ } else { _%>
    update(<%= entityInstance %>: <%= entityAngularName %>):
        Observable<EntityResponseType> {
    <%_ } _%>
        <%_ if (hasDate) { _%>
        const copy = this.convertDateFromClient(<%= entityInstance %>);
        <%_ } _%>
            return this.http.put<<%= entityAngularName %>>(this.resourceUrl,
                    <%_ if (hasDate) { _%> copy <%_ } else { _%> <%= entityInstance %> <%_ } _%>,
                    { observe: 'response' })
            <%_ if (hasDate) { _%>.map((res: EntityResponseType) => this.convertDateFromServer(res))<%_ } _%>;
    }

    find(id: <% if (pkType === 'String') { %>string<% } else { %>number<% } %>): Observable<EntityResponseType> {
        return this.http.get<<%= entityAngularName %>>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            <%_ if (hasDate) { _%>.map((res: EntityResponseType) => this.convertDateFromServer(res))<%_ } _%>;
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<<%= entityAngularName %>[]>(this.resourceUrl, { params: options, observe: 'response' })
            <%_ if (hasDate) { _%>.map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res))<%_ } _%>;
    }

    delete(id: <% if (pkType === 'String') { %>string<% } else { %>number<% } %>): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    <%_ if (searchEngine === 'elasticsearch') { _%>
    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<<%= entityAngularName %>[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            <%_ if (hasDate) { _%>.map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res))<%_ } _%>;
    }
    <%_ } _%>

    <%_ if (hasDate) { _%>
    private convertDateFromClient(<%= entityInstance %>: <%= entityAngularName %>): <%= entityAngularName %> {
        const copy: <%= entityAngularName %> = Object.assign({}, <%= entityInstance %>, {
        <%_ for (idx in fields) { _%>
        <%_ if ( ['Instant', 'ZonedDateTime', 'LocalDate'].includes(fields[idx].fieldType) ) { _%>
        <%= fields[idx].fieldName %>: <%= entityInstance %>.<%= fields[idx].fieldName %> != null && <%= entityInstance %>.<%= fields[idx].fieldName %>.isValid() ? <%= entityInstance %>.<%= fields[idx].fieldName %>.toJSON() : null,
        });
        <%_ } _%>
        <%_ } _%>
        return copy;
    }
    <%_ } _%>

    <%_ if (hasDate) { _%>
    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.date = res.body.date != null ? moment(res.body.date) : res.body.date;
        return res;
    }
    <%_ } _%>

    <%_ if (hasDate) { _%>
    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        for (let i = 0; i < res.body.length; i++) {
            res.body[i].date = res.body[i].date != null ? moment(res.body[i].date) : res.body[i].date;
        }
        return res;
    }
    <%_ } _%>
}
